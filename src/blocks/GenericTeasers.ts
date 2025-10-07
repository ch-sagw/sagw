import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

// Example: Early Career Award, Institutes Overview
// Example: Magazine Detail

const TeaserItem: Field[] = [
  {
    localized: true,
    name: 'title',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'text',
    required: false,
    type: 'text',
  },
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

export const GenericTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'lead',
      required: false,
      type: 'text',
    },
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
};
