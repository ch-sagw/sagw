import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const PublicationsTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    {
      admin: {
        description: 'Do you want to add a link to the Publications overview page?',
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
        condition: (_, siblingData): boolean => siblingData.link === 'yes',
      },
      localized: true,
      name: 'linkText',
      required: true,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the latest publications teasers will be displayed here.',
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
  interfaceName: 'InterfacePublicationsTeasersBlock',
  labels: {
    plural: 'Publications Teasers (automatic)',
    singular: 'Publications Teasers (automatic)',
  },
  slug: 'publicationsTeasersBlock',
} as const satisfies Block;
