import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { alignementHorizontalVertical } from '@/field-templates/alignement';

// Example: Early Career Award, Institutes Overview
// Example: Magazine Detail

const TeaserItem: Field[] = [
  rte1({
    name: 'title',
  }),
  rte1({
    name: 'text',
    notRequired: true,
  }),
  {
    name: 'image',
    relationTo: [
      'images',
      'svgs',
    ],
    required: false,
    type: 'relationship',
  },
  ...fieldsLinkInternalOrExternal({}),
];

export const GenericTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    rte1({
      name: 'lead',
      notRequired: true,
    }),
    alignementHorizontalVertical,
    {
      fields: TeaserItem,
      name: 'teasers',
      required: true,
      type: 'array',
    },

  ],
  imageURL: '/admin-ui-images/image-teasers.svg',
  interfaceName: 'InterfaceGenericTeasersBlock',
  labels: {
    plural: 'Generic Teasers',
    singular: 'Generic Teasers',
  },
  slug: 'genericTeasersBlock',
} as const satisfies Block;
