import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const EventsTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    {
      access: fieldAccessNonLocalizableField,
      admin: {
        description: 'Do you want to add a link to the Events overview page? Note: This link will not be shown on project detail pages.',
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
      ...rte2({
        adminCondition: (_, siblingData): boolean => siblingData.link === 'yes',
        name: 'linkText',
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
} as const satisfies Block;
