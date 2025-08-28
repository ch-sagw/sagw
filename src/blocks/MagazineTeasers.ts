import { Block } from 'payload';

export const MagazineTeasersBlock: Block = {
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
      localized: true,
      name: 'lead',
      required: false,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the latest magazine entries will be displayed here.',
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
    plural: 'Magazine Teasers',
    singular: 'Magazine Teasers',
  },
  slug: 'magazineTeasersBlock',
};
