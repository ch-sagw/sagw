import { Block } from 'payload';

export const PublicationsTeasersBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'linkText',
      required: true,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the latest publications teasers will be displayed here.',
      name: 'message',
      type: 'text',
    },
    {
      admin: {
        components: {
          Field: '@/components/admin/BlockInfo',
        },
      },
      name: 'explanation',
      type: 'ui',
    },
  ],
  labels: {
    plural: 'Publications Teasers',
    singular: 'Publications Teasers',
  },
  slug: 'publicationsTeasersBlock',
};
