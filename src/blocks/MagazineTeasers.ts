import { Block } from 'payload';

// Example: Activities

export const MagazineTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
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
  imageURL: '/admin-ui-images/teasers.svg',
  interfaceName: 'InterfaceMagazineTeasersBlock',
  labels: {
    plural: 'Magazine Teasers (automatic)',
    singular: 'Magazine Teasers (automatic)',
  },
  slug: 'magazineTeasersBlock',
};
