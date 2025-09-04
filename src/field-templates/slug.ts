import { Field } from 'payload';

export const fieldSlugFieldName = 'slug';

export const fieldSlug: Field = {
  admin: {
    description: 'The slug is visible in the url for this page, example: https://sagw.ch/detailPage/here-comes-the-slug . This value is automatically defined by the hero title.',
    readOnly: true,
  },
  label: 'Slug',
  localized: true,
  name: fieldSlugFieldName,
  type: 'text',
};
