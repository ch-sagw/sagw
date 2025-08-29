import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternal } from '@/field-templates/links';

const textTeaserItem: Field[] = [
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
    fields: fieldsLinkInternal,
    name: 'link',
    type: 'group',
  },
];

export const TextTeasersBlock: Block = {
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
      required: true,
      type: 'textarea',
    },
    {
      fields: textTeaserItem,
      name: 'textTeasers',
      type: 'array',
    },
  ],
  labels: {
    plural: 'Text Teasers',
    singular: 'Text Teasers',
  },
  slug: 'textTeasersBlock',
};
