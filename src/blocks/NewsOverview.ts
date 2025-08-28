import { Block } from 'payload';

export const NewsOverviewBlock: Block = {
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: the news overview will be displayed here.',
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
    plural: 'News Overview',
    singular: 'News Overview',
  },
  slug: 'newsOverviewBlock',
};
