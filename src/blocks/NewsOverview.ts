import { Block } from 'payload';

// Example: Magazine Overview

export const NewsOverviewBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all news entries will be displayed as overview here.',
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
    plural: 'News Overview (automatic)',
    singular: 'News Overview (automatic)',
  },
  slug: 'newsOverviewBlock',
};
