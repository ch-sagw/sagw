import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const EventsTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
      required: true,
    }),
    {
      admin: {
        description: 'Do you want to add a link to the Events overview page?',
      },
      defaultValue: 'no',
      name: 'link',
      options: [
        {
          label: 'No',
          value: 'no',
        },
        {
          label: 'Yes',
          value: 'yes',
        },
      ],
      type: 'radio',
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.link === 'yes',
      },
      ...rte1({
        name: 'linkText',
        required: true,
      }),
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
  interfaceName: 'InterfaceEventsTeasersBlock',
  labels: {
    plural: 'Events Teasers (automatic)',
    singular: 'Events Teasers (automatic)',
  },
  slug: 'eventsTeasersBlock',
};
