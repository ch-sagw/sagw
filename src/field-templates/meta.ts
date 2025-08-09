import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
} from '@payloadcms/plugin-seo/fields';
import { Tab } from 'payload';

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
      ],
      label: 'General',
      name: 'seo',
      type: 'group',
    },
  ],
  label: 'Meta',
  name: 'meta',
};
