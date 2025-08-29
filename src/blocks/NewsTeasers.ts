import { Block } from 'payload';

export const NewsTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
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
      defaultValue: 'Note: the newest news teasers will be displayed here.',
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
    plural: 'News Teasers (automatic)',
    singular: 'News Teasers (automatic)',
  },
  slug: 'newsTeasersBlock',
};
