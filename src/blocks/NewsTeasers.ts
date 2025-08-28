import { Block } from 'payload';

export const NewsTeasersBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
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
    plural: 'News Teasers',
    singular: 'News Teasers',
  },
  slug: 'newsTeasersBlock',
};
