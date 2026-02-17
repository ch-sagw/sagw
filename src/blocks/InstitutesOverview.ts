import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Institutes Overview

export const InstitutesOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      ...rte1({
        adminDescription: 'This is the text behind which the link to the institute detail pages is hidden.',
        label: 'Link Text',
        name: 'moreInfoButtonText',
      }),
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all institute detail pages will be displayed as overview here.',
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
  interfaceName: 'InterfaceInstitutesOverviewBlock',
  labels: {
    plural: 'Institutes Overview (automatic)',
    singular: 'Institutes Overview (automatic)',
  },
  slug: 'institutesOverviewBlock',
} as const satisfies Block;
