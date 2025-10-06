import {
  Block, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';

// Example: Network

const fieldsNetworkItem: Field[] = [
  rte1({
    name: 'title',
    required: true,
  }),
  {
    name: 'category',
    relationTo: 'networkCategories',
    required: true,
    type: 'relationship',
  },
  {
    name: 'foundingYear',
    required: false,
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
        rte1({
          name: 'allCheckboxText',
        }),
        rte1({
          name: 'title',
        }),
      ],
      label: 'Filter',
      name: 'filter',
      type: 'group',
    },

    // Network items
    {
      fields: [
        rte1({
          name: 'foundingYearText',
          notRequired: true,
        }),
        rte1({
          name: 'linkText',
        }),
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
