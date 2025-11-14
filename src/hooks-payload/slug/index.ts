import {
  CollectionBeforeValidateHook, ValidationError,
  Where,
} from 'payload';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { fieldSlugFieldName } from '@/field-templates/slug';
import slugify from 'slugify';

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

  const adminTitle = data[fieldAdminTitleFieldName];

  if (!adminTitle) {
    dataParam[fieldSlugFieldName] = data.id;

    return dataParam;
  }

  const tenant = dataParam.tenant || req.user?.tenants;

  if (!tenant) {
    return dataParam;
  }

  const desiredSlug = slugify(adminTitle, {
    lower: true,
    strict: true,
    trim: true,
  });

  slugify.extend({
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
  });

  // try to find desired slug in collection items of current tenant
  if (desiredSlug) {
    const searchConstraints: Where[] = [
      {
        tenant: {
          in: tenant,
        },
      },
      {
        slug: {
          equals: desiredSlug,
        },
      },
      {
        id: {
          /* eslint-disable @typescript-eslint/naming-convention */
          not_equals: originalDoc.id,
          /* eslint-enable @typescript-eslint/naming-convention */
        },
      },
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
            message: `Slug "${desiredSlug}" already exists in this tenant`,
            path: 'slug',
          },
        ],
        global: `Slug "${desiredSlug}" already exists in this tenant`,
      });
    } else if (desiredSlug) {

      dataParam[fieldSlugFieldName] = desiredSlug;
    }
  }

  return dataParam;
};
