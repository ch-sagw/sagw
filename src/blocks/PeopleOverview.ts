import { Block } from 'payload';

// Example: About SAGW -> Team

export const PeopleOverviewBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all people entries will be displayed as overview here.',
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
    plural: 'People Overview (automatic)',
    singular: 'People Overview (automatic)',
  },
  slug: 'peopleOverviewBlock',
};
