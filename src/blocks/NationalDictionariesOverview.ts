import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Overview

export const NationalDictionariesOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      ...rte1({
        adminDescription: 'This is the text behind which the link to the national dictionary detail pages is hidden.',
        label: 'Link Text',
        name: 'moreInfoButtonText',
      }),
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all national dictionary detail pages will be displayed as overview here.',
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
  imageURL: '/admin-ui-images/overview.svg',
  interfaceName: 'InterfaceNationalDictionariesOverviewBlock',
  labels: {
    plural: 'National Dictionaries Overview (automatic)',
    singular: 'National Dictionaries Overview (automatic)',
  },
  slug: 'nationalDictionariesOverviewBlock',
} as const satisfies Block;
