import {
  Block, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import {
  fieldAccessLocalizableField, fieldAccessNonLocalizableField,
} from '@/access/fields/localizedFields';

// Example: Network

const fieldsNetworkItem: Field[] = [
  rte1({
    access: fieldAccessLocalizableField,
    name: 'title',
  }),
  {
    admin: {
      width: '50%',
    },
    fields: [
      {
        access: fieldAccessNonLocalizableField,
        admin: {
          description: 'Needed for filter on overview page.',
        },
        name: 'category',
        relationTo: 'networkCategories',
        required: true,
        type: 'relationship',
      },
      {
        access: fieldAccessNonLocalizableField,
        name: 'foundingYear',
        required: false,
        type: 'number',
      },
    ],
    type: 'row',
  },
  {
    access: fieldAccessNonLocalizableField,
    name: 'image',
    relationTo: 'images',
    required: true,
    type: 'upload',
  },
  ...fieldsLinkExternal({
    hideLinkText: true,
  }),
];

export const NetworkTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    // Filter
    {
      fields: [
        rte1({
          label: 'Text for button "all"',
          name: 'allCheckboxText',
        }),
        rte1({
          label: 'Filter Title',
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
          adminDescription: 'The text in this field will be displayed before the founding year. For example, "Gründungsjahr" in German. The year is added in the respective network item.',
          name: 'foundingYearText',
          notRequired: true,
        }),
        rte2({
          name: 'linkText',
        }),
        {
          access: fieldAccessNonLocalizableField,
          fields: fieldsNetworkItem,
          label: 'Network items global',
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
} as const satisfies Block;
