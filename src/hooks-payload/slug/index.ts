import {
  type Field, type FieldHook,
  ValidationError, Where,
} from 'payload';
import slugify from 'slugify';
import {
  setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { getLocaleCodes } from '@/i18n/payloadConfig';

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

// Slug field beforeChange: runs after the generateSlug checkbox field in
// the same row (Payload traverses row fields in order).
// Collection beforeValidate / collection beforeChange run before field
// beforeChange, so uniqueness must run here—after
// generateSlug populates slug from adminTitle.

export const hookSlug: FieldHook = async ({
  collection,
  data: dataParam,
  operation,
  originalDoc,
  req,
  siblingData,
  value,
}) => {
  if (!collection) {
    return value;
  }

  // Only enforce on create or update
  if (operation !== 'create' && operation !== 'update') {
    return value;
  }

  const data = siblingData ?? dataParam;

  if (!data) {
    return value;
  }

  const tenant = data.tenant || req.user?.tenants;

  if (!tenant) {
    return value;
  }

  if (!data.slug) {
    return value;
  }

  // in case author changed the slug manually, slugify it

  slugify.extend({
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
  });

  const desiredSlug = slugify(data.slug, {
    lower: true,
    strict: true,
    trim: true,
  });

  data.slug = desiredSlug;

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
          equals: data.slug,
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
          message: `Slug "${data.slug}" already exists in this tenant`,
          path: 'slug',
        },
      ],
      global: `Slug "${data.slug}" already exists in this tenant`,
    });
  }

  // prevent SAGW pages from using slugs that match other tenants' slugs.
  const currentTenantDocs = await req.payload.find({
    collection: 'tenants',
    locale: 'all',
    overrideAccess: true,
    where: {
      id: {
        equals: tenant,
      },
    },
  });

  if (currentTenantDocs.docs.length !== 1) {
    return data.slug;
  }

  const tenantSlugs = currentTenantDocs.docs[0].slug;
  const slugValues = (slug: string | Record<string, string>): string[] => {
    if (typeof slug === 'string') {
      return [slug];
    }

    return getLocaleCodes()
      .map((locale) => slug[locale] ?? '')
      .filter(Boolean);
  };
  const tenantSlugsArray = slugValues(tenantSlugs);
  const isSagw = tenantSlugsArray.some((s) => s.toLowerCase() === 'sagw');

  if (!isSagw) {
    return data.slug;
  }

  const allTenants = await req.payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 0,
    locale: 'all',
    overrideAccess: true,
  });

  const conflictingTenant = allTenants.docs.find((t) => {
    if (tenant === t.id) {
      return false;
    }

    const potenationConflictingTenantSlugs = slugValues(t.slug);

    return potenationConflictingTenantSlugs.some((s) => s === data.slug);
  });

  if (conflictingTenant) {
    throw new ValidationError({
      errors: [
        {
          label: 'slug',
          message: `Slug "${data.slug}" conflicts with another tenant's URL and cannot be used`,
          path: 'slug',
        },
      ],
      global: `Slug "${data.slug}" conflicts with another tenant's URL and cannot be used`,
    });
  }

  return data.slug;
};
