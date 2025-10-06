import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Institutes Overview

export const InstitutesOverviewBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        description: 'This will be used as "More info" text on the teasers',
      },
      ...rte1({
        name: 'moreInfoButtonText',
        required: true,
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
};
