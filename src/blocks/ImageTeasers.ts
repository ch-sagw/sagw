import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

// Example: Early Career Award, Institutes Overview

const ImageTeaserItem: Field[] = [
  {
    name: 'image',
    relationTo: [
      'images',
      'svgs',
    ],
    required: true,
    type: 'relationship',
  },
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
  ...fieldsLinkInternalOrExternal,
];

export const ImageTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: false,
      type: 'text',
    },
    {
      fields: ImageTeaserItem,
      name: 'teasers',
      required: true,
      type: 'array',
    },

  ],
  labels: {
    plural: 'Image Teasers',
    singular: 'Image Teasers',
  },
  slug: 'imageTeasersBlock',
};
