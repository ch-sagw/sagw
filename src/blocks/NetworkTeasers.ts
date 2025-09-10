import {
  Block, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';

// Example: Network

const fieldsNetworkItem: Field[] = [
  {
    localized: true,
    name: 'title',
    required: true,
    type: 'text',
  },
  {
    name: 'category',
    relationTo: 'networkCategories',
    required: true,
    type: 'relationship',
  },
  {
    name: 'foundingYear',
    required: true,
    type: 'number',
  },
  {
    name: 'image',
    relationTo: 'images',
    required: true,
    type: 'upload',
  },
  ...fieldsLinkExternal.filter((field) => {
    if ('name' in field && field.name === 'externalLinkText') {
      return false;
    }

    return true;
  }),
];

export const NetworkTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    // Filter
    {
      fields: [
        {
          localized: true,
          name: 'allCheckboxText',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
      ],
      label: 'Filter',
      name: 'filter',
      type: 'group',
    },

    // Network items
    {
      fields: [
        {
          localized: true,
          name: 'foundingYearText',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'linkText',
          required: true,
          type: 'text',
        },
        {
          fields: fieldsNetworkItem,
          label: 'Network items',
          name: 'items',
          required: true,
          type: 'array',
        },
      ],
      label: 'Network items',
      name: 'items',
      type: 'group',
    },
  ],
  imageURL: '/admin-ui-images/network-teasers.svg',
  interfaceName: 'InterfaceNetworkTeasersBlock',
  labels: {
    plural: 'Network Teasers',
    singular: 'Network Teasers',
  },
  slug: 'networkTeasersBlock',
};
