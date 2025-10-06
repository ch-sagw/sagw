import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Overview

export const NewsOverviewBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all news entries will be displayed as overview here.',
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
  interfaceName: 'InterfaceNewsOverviewBlock',
  labels: {
    plural: 'News Overview (automatic)',
    singular: 'News Overview (automatic)',
  },
  slug: 'newsOverviewBlock',
};
