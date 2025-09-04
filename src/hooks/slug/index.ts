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
  console.log('###########################################################');
  console.log('###########################################################');
  console.log('1 start');

  // Only enforce on create or update
  if (![
    'create',
    'update',
  ].includes(operation)) {
    console.log('1a: return since not create or update');

    return data;
  }

  const dataParam = data;

  if (!dataParam) {
    console.log('1b: return, no data param');

    return dataParam;
  }

  const adminTitle = data[fieldAdminTitleFieldName];

  if (!adminTitle) {
    console.log('1c: return, no admin title');

    dataParam[fieldSlugFieldName] = data.id;

    return dataParam;
  }

  const department = dataParam.department || req.user?.department;

  console.log('department', department);

  if (!department) {
    console.log('1d: return, no department');

    return dataParam;
  }

  const desiredSlug = slugify(adminTitle, {
    lower: true,
    strict: true,
    trim: true,
  });

  let existingError = false;

  // try to find desired slug in collection items of current tenant
  console.log('2 desired slug', desiredSlug);
  if (desiredSlug) {
    const existing = await req.payload.find({
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
            slug: {
              equals: desiredSlug,
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

    console.log('3 existing');

    if (existing.totalDocs > 0) {

      // only report error if the found doc is not the currently edited one.
      const isSelf = operation === 'update' && existing.docs[0].id === dataParam.id;

      if (!isSelf) {
        existingError = true;
        console.log('4 error');

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
    console.log('5 set value');
    dataParam[fieldSlugFieldName] = desiredSlug;
  }

  console.log('6 return');

  return dataParam;
};
