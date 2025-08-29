import { CollectionConfig } from 'payload';

export const I18nGlobal: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'i18n',
  },
  fields: [
    {
      fields: [
        {
          localized: true,
          name: 'download',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'links',
          required: true,
          type: 'text',
        },
      ],
      label: 'Section Titles',
      name: 'sectionTitles',
      type: 'group',
    },
  ],
  slug: 'i18nGlobals',
};
