import { alignementHorizontalVertical } from '@/field-templates/alignement';
import { fieldsLinkInternal } from '@/field-templates/links';
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
    alignementHorizontalVertical,
    ...fieldsLinkInternal({
      optional: true,
    }),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the latest magazine entries will be displayed here.',
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
