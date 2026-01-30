import {
  CollectionBeforeValidateHook, ValidationError,
  Where,
} from 'payload';
import slugify from 'slugify';

/**
 * - Ensure unuqie slug in same tenant
 * - slugify slug (authors may edit the slug after generation... we need to
 * validate)
 */

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

  // try to find slug in collection items of current tenant

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
    ...(originalDoc?.id
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

  if ('_published' in collection) {
    searchConstraints.push({

      /* eslint-disable @typescript-eslint/naming-convention */
      _status: {
        equals: 'published',
      },
      /* eslint-enable @typescript-eslint/naming-convention */
    });
  }

  const existing = await req.payload.find({
    collection: collection.slug,
    limit: 1,
    where: {
      and: searchConstraints,
    },
  });

  if (existing.docs.length > 0) {

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
