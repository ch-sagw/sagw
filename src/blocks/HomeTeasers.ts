import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternal } from '@/field-templates/links';

const homeTeaserItem: Field[] = [
  {
    localized: true,
    name: 'category',
    required: true,
    type: 'text',
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
    required: true,
    type: 'textarea',
  },
  {
    name: 'icon',
    relationTo: 'svgs',
    required: true,
    type: 'relationship',
  },
  ...fieldsLinkInternal,
];

export const HomeTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      fields: homeTeaserItem,
      name: 'homeTeasers',
      type: 'array',
    },
  ],
  labels: {
    plural: 'Home Teasers',
    singular: 'Home Teasers',
  },
  slug: 'homeTeasersBlock',
};
