import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

// Example: Promotion, Activities

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
    fields: fieldsLinkInternalOrExternal,
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
      fields: textTeaserItem,
      name: 'textTeasers',
      type: 'array',
    },
  ],
  imageURL: '/admin-ui-images/text-teasers.svg',
  interfaceName: 'InterfaceTextTeasersBlock',
  labels: {
    plural: 'Text Teasers',
    singular: 'Text Teasers',
  },
  slug: 'textTeasersBlock',
};
