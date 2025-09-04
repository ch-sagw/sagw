import { CollectionBeforeValidateHook } from 'payload';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { fieldSlugFieldName } from '@/field-templates/slug';
import slugify from 'slugify';

export const hookSlug: CollectionBeforeValidateHook = ({
  data,
}) => {
  if (!data) {
    return data;
  }

  const adminTitle = data[fieldAdminTitleFieldName];

  if (!adminTitle) {
    data[fieldSlugFieldName] = '';

    return data;
  }

  data[fieldSlugFieldName] = slugify(adminTitle, {
    lower: true,
    strict: true,
    trim: true,
  });

  return data;
};
