import { Block } from 'payload';

// Example: Magazine Overview

export const NationalDictionariesOverviewBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
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
};
