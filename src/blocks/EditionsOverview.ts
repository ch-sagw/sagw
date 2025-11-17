import {
  Block, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

// Example: Editions Overview

const editionItem: Field[] = [
  rte1({
    name: 'title',
  }),
  rte1({
    name: 'text',
  }),
  ...fieldsLinkExternal({
    hideLinkText: true,
  }),
];

export const EditionsOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      fields: [
        {
          access: fieldAccessNonLocalizableField,
          fields: editionItem,
          label: 'Edition items',
          name: 'items',
          required: true,
          type: 'array',
        },
      ],
      label: '',
      name: 'items',
      type: 'group',
    },
  ],
  imageURL: '/admin-ui-images/overview.svg',
  interfaceName: 'InterfaceEditionsOverviewBlock',
  labels: {
    plural: 'Editions Overview (manual)',
    singular: 'Editions Overview (manual)',
  },
  slug: 'editionsOverview',
} as const satisfies Block;
