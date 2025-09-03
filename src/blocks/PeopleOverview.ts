import { Block } from 'payload';
import { memberTypeConfig } from '@/collections/Plc/People';

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
      fields: [
        {
          defaultValue: true,
          label: memberTypeConfig.executiveBoard.label,
          name: memberTypeConfig.executiveBoard.value,
          type: 'checkbox',
        },
        {
          defaultValue: true,
          label: memberTypeConfig.team.label,
          name: memberTypeConfig.team.value,
          type: 'checkbox',
        },
      ],
      label: 'Which member types do you want to display in the overview?',
      name: 'memberType',
      type: 'group',
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
    plural: 'People Overview (automatic)',
    singular: 'People Overview (automatic)',
  },
  slug: 'peopleOverviewBlock',
};
