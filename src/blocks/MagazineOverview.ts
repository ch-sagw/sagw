import { Block } from 'payload';

// Example: Magazine Overview

export const MagazineOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all magazine entries will be displayed as overview here.',
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
  interfaceName: 'InterfaceMagazineOverviewBlock',
  labels: {
    plural: 'Magazine Overview (automatic)',
    singular: 'Magazine Overview (automatic)',
  },
  slug: 'magazineOverviewBlock',
} as const satisfies Block;
