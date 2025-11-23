import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { alignementHorizontalVertical } from '@/field-templates/alignement';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

// Example: Early Career Award, Institutes Overview
// Example: Magazine Detail

const TeaserItem: Field[] = [
  rte1({
    name: 'title',
  }),
  rte2({
    name: 'text',
    notRequired: true,
  }),
  {
    access: fieldAccessNonLocalizableField,
    name: 'image',
    relationTo: ['images'],
    required: false,
    type: 'relationship',
  },
  ...fieldsLinkInternalOrExternal({}),
];

export const GenericTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    rte2({
      name: 'lead',
      notRequired: true,
    }),
    alignementHorizontalVertical,
    {
      access: fieldAccessNonLocalizableField,
      fields: TeaserItem,
      maxRows: 3,
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
} as const satisfies Block;
