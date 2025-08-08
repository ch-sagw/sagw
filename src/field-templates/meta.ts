import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
} from '@payloadcms/plugin-seo/fields';
import {
  Field, Tab,
} from 'payload';

const fieldsSeo: Field[] = [
  /* eslint-disable new-cap */
  MetaTitleField({
    hasGenerateFn: true,
  }),
  MetaImageField({
    overrides: {
      localized: false,
    },
    relationTo: 'images',
  }),

  MetaDescriptionField({}),
  /* eslint-enable new-cap */
];

const fieldsOg: Field[] = [
  {
    localized: true,
    name: 'Title',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'Description',
    required: true,
    type: 'textarea',
  },
  {
    name: 'image',
    relationTo: 'images',
    required: true,
    type: 'relationship',
  },
];

export const fieldsTabMeta: Tab = {
  fields: [
    {
      fields: [
        {
          defaultValue: true,
          label: 'Index for crawlers',
          name: 'index',
          type: 'checkbox',
        },
        ...fieldsSeo,
      ],
      label: 'General',
      name: 'seo',
      type: 'group',
    },
    {
      fields: fieldsOg,
      label: 'Open Graph',
      name: 'openGraph',
      type: 'group',
    },
  ],
  label: 'Meta',
  name: 'meta',
};
