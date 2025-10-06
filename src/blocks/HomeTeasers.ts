import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';

// Example: SAGW home only

const homeTeaserItem: Field[] = [
  {
    localized: true,
    name: 'category',
    required: true,
    type: 'text',
  },
  rte1({
    name: 'title',
  }),
  rte1({
    name: 'text',
  }),
  {
    name: 'icon',
    relationTo: 'svgs',
    required: true,
    type: 'relationship',
  },
  {
    fields: [...fieldsLinkInternal],
    name: 'link',
    type: 'group',
  },
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
  imageURL: '/admin-ui-images/home-teasers.svg',
  interfaceName: 'InterfaceHomeTeasersBlock',
  labels: {
    plural: 'Home Teasers',
    singular: 'Home Teasers',
  },
  slug: 'homeTeasersBlock',
};
