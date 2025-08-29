import { Block } from 'payload';

// Example: Activities

export const EventsTeasersBlock: Block = {
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
      label: 'Only show events from a specific project',
      name: 'project',
      relationTo: 'projects',
      required: false,
      type: 'relationship',
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the upcoming events teasers will be displayed here.',
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
  labels: {
    plural: 'Events Teasers (automatic)',
    singular: 'Events Teasers (automatic)',
  },
  slug: 'eventsTeasersBlock',
};
