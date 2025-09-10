import { Block } from 'payload';

// Example: Activities

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
      hasMany: false,
      label: 'Only show news from a specific project',
      name: 'project',
      relationTo: 'projects',
      required: false,
      type: 'relationship',
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
  imageURL: '/admin-ui-images/teasers.svg',
  interfaceName: 'InterfaceNewsTeasersBlock',
  labels: {
    plural: 'News Teasers (automatic)',
    singular: 'News Teasers (automatic)',
  },
  slug: 'newsTeasersBlock',
};
