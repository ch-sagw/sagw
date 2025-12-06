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
        adminDescription: 'This will be used as "More info" text on the teasers',
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
