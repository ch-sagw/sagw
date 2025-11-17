import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

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

  // TODO: add icon names as soon as we implemented the icons
  {
    access: fieldAccessNonLocalizableField,
    name: 'iconName',
    options: [
      {
        label: 'foo',
        value: 'bar',
      },
    ],
    required: true,
    type: 'select',
  },
  {
    fields: [...fieldsLinkInternal({})],
    name: 'link',
    type: 'group',
  },
];

export const HomeTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      access: fieldAccessNonLocalizableField,
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
} as const satisfies Block;
