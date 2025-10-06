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
        description: 'Which team members do you want to display in the overview?',
      },
      name: 'teams',
      relationTo: 'teams',
      required: true,
      type: 'relationship',
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
  interfaceName: 'InterfacePeopleOverviewBlock',
  labels: {
    plural: 'People Overview (automatic)',
    singular: 'People Overview (automatic)',
  },
  slug: 'peopleOverviewBlock',
};
