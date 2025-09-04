import {
  CollectionBeforeValidateHook, ValidationError,
} from 'payload';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { fieldSlugFieldName } from '@/field-templates/slug';
import slugify from 'slugify';

export const hookSlug: CollectionBeforeValidateHook = async ({
  data,
  collection,
  req,
  operation,
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

  const department = dataParam.department || req.user?.department;

  if (!department) {
    return dataParam;
  }

  const desiredSlug = slugify(adminTitle, {
    lower: true,
    strict: true,
    trim: true,
  });

  let existingError = false;

  // try to find desired slug in collection items of current tenant
  if (desiredSlug) {
    const tenantCollections = await req.payload.find({
      collection: collection.slug,
      limit: 1,
      where: {
        and: [
          {
            department: {
              equals: department,
            },
          },
          {
            /* eslint-disable @typescript-eslint/naming-convention */
            _status: {
              equals: 'published',
            },
            /* eslint-enable @typescript-eslint/naming-convention */
          },
        ],
      },
    });

    const existing = tenantCollections.docs.filter((tenantCollection) => (('slug' in tenantCollection) && tenantCollection.slug === desiredSlug));

    if (existing.length > 0) {

      // only report error if the found doc is not the currently edited one.
      const isSelf = operation === 'update' && existing[0].id === dataParam.id;

      if (!isSelf) {
        existingError = true;

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
      }
    }
  }

  if (!existingError) {
    dataParam[fieldSlugFieldName] = desiredSlug;
  }

  return dataParam;
};
