import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const NewsTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    {
      admin: {
        description: 'Do you want to add a link to the News overview page? Note: This link will not be shown on project detail pages.',
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
      ...rte1({
        adminCondition: (_, siblingData): boolean => siblingData.link === 'yes',
        adminDescription: 'foo bar',
        name: 'linkText',
      }),
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the newest news teasers will be displayed here.',
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
  interfaceName: 'InterfaceNewsTeasersBlock',
  labels: {
    plural: 'News Teasers (automatic)',
    singular: 'News Teasers (automatic)',
  },
  slug: 'newsTeasersBlock',
} as const satisfies Block;
