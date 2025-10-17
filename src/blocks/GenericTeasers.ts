import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';

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
  ...fieldsLinkInternalOrExternal,
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
    {
      admin: {
        description: 'Align Title & text horizontally or vertically',
      },
      defaultValue: 'vertical',
      name: 'alignement',
      options: [
        {
          label: 'vertical',
          value: 'vertical',
        },
        {
          label: 'horizontal',
          value: 'horizontal',
        },
      ],
      type: 'select',
    },
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
