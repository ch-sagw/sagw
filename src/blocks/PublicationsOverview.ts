import { Block } from 'payload';

// Example: Publications Overview

export const PublicationsOverviewBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all publications entries will be displayed as overview here.',
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
  imageURL: '/admin-ui-images/overview.svg',
  labels: {
    plural: 'Publications Overview (automatic)',
    singular: 'Publications Overview (automatic)',
  },
  slug: 'publicationsOverviewBlock',
};
