import {
  Block, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';
import { rte2 } from '@/field-templates/rte';
import {
  fieldAccessLocalizableField, fieldAccessNonLocalizableField,
} from '@/access/fields/localizedFields';

// Example: Editions Overview

const editionItem: Field[] = [
  rte2({
    access: fieldAccessLocalizableField,
    name: 'title',
  }),
  rte2({
    access: fieldAccessLocalizableField,
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
        rte2({
          adminDescription: 'This is the text behind which the link is hidden.',
          name: 'linkText',
        }),
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
