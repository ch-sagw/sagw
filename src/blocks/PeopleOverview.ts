import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import { Block } from 'payload';

// Example: About SAGW -> Team

export const PeopleOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: All people entries belonging to the selected team will be displayed as an overview here.',
      name: 'message',
      type: 'text',
    },
    {
      access: fieldAccessNonLocalizableField,
      admin: {
        description: 'Which team do you want to display on the page?',
      },
      label: 'Team',
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
} as const satisfies Block;
