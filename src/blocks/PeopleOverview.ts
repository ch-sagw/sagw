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
          name: 'type',
          options: [
            {
              label: memberTypeConfig.executiveBoard.label,
              value: memberTypeConfig.executiveBoard.value,
            },
            {
              label: memberTypeConfig.team.label,
              value: memberTypeConfig.team.value,
            },
          ],
          required: true,
          type: 'select',
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
