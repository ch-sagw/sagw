import { alignmentHorizontalVertical } from '@/field-templates/alignment';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const MagazineTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    rte2({
      name: 'lead',
      notRequired: true,
    }),
    alignmentHorizontalVertical,
    fieldsLinkInternalWithToggle({
      adminDescriptionLink: 'Here you can link to the overview page with all magazine entries.',
    }),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the latest four magazine entries will be displayed here.',
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
  interfaceName: 'InterfaceMagazineTeasersBlock',
  labels: {
    plural: 'Magazine Teasers (automatic)',
    singular: 'Magazine Teasers (automatic)',
  },
  slug: 'magazineTeasersBlock',
} as const satisfies Block;
