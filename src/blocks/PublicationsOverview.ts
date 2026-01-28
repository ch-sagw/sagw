import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Publications Overview

export const PublicationsOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    rte1({
      name: 'filterTitleAllTopics',
    }),
    rte1({
      label: 'Filter Title all types',
      name: 'filterTitleAllPublications',
    }),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all publications entries will be displayed as overview here.',
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
  interfaceName: 'InterfacePublicationsOverviewBlock',
  labels: {
    plural: 'Publications Overview (automatic)',
    singular: 'Publications Overview (automatic)',
  },
  slug: 'publicationsOverviewBlock',
} as const satisfies Block;
