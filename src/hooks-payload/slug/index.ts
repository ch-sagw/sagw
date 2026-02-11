import {
  CollectionBeforeValidateHook, type Field,
  ValidationError, Where,
} from 'payload';
import slugify from 'slugify';
import {
  setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';

// - ensure unique slug in same tenant across all page collections
// - slugify slug (authors may edit the slug after generation... we need to
// validate

// helper to check if a collection has a slug field
const hasSlugField = (fields: Field[] | undefined): boolean => {
  if (!fields) {
    return false;
  }

  for (const field of fields) {
    // Check if field affects data and has name 'slug'
    if ('name' in field && field.name === 'slug' && 'type' in field) {
      return true;
    }

    // Recursively check nested fields (for groups, arrays, tabs, etc.)
    if ('fields' in field && field.fields) {
      if (hasSlugField(field.fields)) {
        return true;
      }
    }

    // Check tabs fields
    if (field.type === 'tabs' && 'tabs' in field && Array.isArray(field.tabs)) {
      for (const tab of field.tabs) {
        if ('fields' in tab && tab.fields && hasSlugField(tab.fields)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const hookSlug: CollectionBeforeValidateHook = async ({
  data,
  collection,
  req,
  operation,
  originalDoc,
}) => {
  // Only enforce on create or update
  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  const dataParam = data;

  if (!dataParam) {
    return dataParam;
  }

  const tenant = dataParam.tenant || req.user?.tenants;

  if (!tenant) {
    return dataParam;
  }

  if (!dataParam.slug) {
    return dataParam;
  }

  // in case author changed the slug manually, slugify it

  slugify.extend({
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
  });

  const desiredSlug = slugify(dataParam['slug'], {
    lower: true,
    strict: true,
    trim: true,
  });

  dataParam['slug'] = desiredSlug;

  // get all page collection slugs
  const allPageCollectionSlugs = [
    ...singletonSlugs.map((s) => s.slug),
    ...setsSlugs.map((s) => s.slug),
  ];

  // filter to only collections that have slug fields
  const collectionsWithSlug = allPageCollectionSlugs.filter((collectionSlug) => {
    const collectionConfig = req.payload.config.collections.find((c) => c.slug === collectionSlug);

    return collectionConfig && hasSlugField(collectionConfig.fields);
  });

  // build search promises for all collections
  const searchPromises = collectionsWithSlug.map(async (collectionSlug) => {
    const searchConstraints: Where[] = [
      {
        tenant: {
          in: tenant,
        },
      },
      {
        slug: {
          equals: dataParam.slug,
        },
      },

      // only exclude the current document if we're updating the same collection
      ...(originalDoc?.id && collectionSlug === collection.slug
        ? [
          {
            id: {
              /* eslint-disable @typescript-eslint/naming-convention */
              not_equals: originalDoc.id,
              /* eslint-enable @typescript-eslint/naming-convention */
            },
          },
        ]
        : []),
    ];

    // check if this collection has drafts enabled
    const collectionConfig = req.payload.config.collections.find((c) => c.slug === collectionSlug);
    const hasDrafts = Boolean(collectionConfig?.versions?.drafts);

    if (hasDrafts) {
      searchConstraints.push({
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: {
          equals: 'published',
        },
        /* eslint-enable @typescript-eslint/naming-convention */
      });
    }

    const existing = await req.payload.find({
      collection: collectionSlug,
      limit: 1,
      where: {
        and: searchConstraints,
      },
    });

    return existing.docs.length > 0;
  });

  // check for any found duplicates
  const results = await Promise.all(searchPromises);
  const hasDuplicate = results.some((found) => found);

  if (hasDuplicate) {
    throw new ValidationError({
      errors: [
        {
          label: 'slug',
          message: `Slug "${dataParam.slug}" already exists in this tenant`,
          path: 'slug',
        },
      ],
      global: `Slug "${dataParam.slug}" already exists in this tenant`,
    });
  }

  return dataParam;
};
