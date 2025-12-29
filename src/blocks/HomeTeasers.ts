import {
  Block, Field,
} from 'payload';
import { fieldsLinkInternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import {
  fieldAccessLocalizableField, fieldAccessNonLocalizableField,
} from '@/access/fields/localizedFields';

// Example: SAGW home only

const homeTeaserItem: Field[] = [
  {
    admin: {
      width: '50%',
    },
    fields: [
      {
        access: fieldAccessLocalizableField,
        localized: true,
        name: 'category',
        required: true,
        type: 'text',
      },
      {
        access: fieldAccessNonLocalizableField,
        name: 'iconName',
        options: [
          {
            label: 'Activities',
            value: 'homeTeaserActivities',
          },
          {
            label: 'Funding',
            value: 'homeTeaserFunding',
          },
          {
            label: 'Network',
            value: 'homeTeaserNetwork',
          },
        ],
        required: true,
        type: 'select',
      },
    ],
    type: 'row',
  },
  rte1({
    access: fieldAccessLocalizableField,
    name: 'title',
  }),
  rte1({
    access: fieldAccessLocalizableField,
    name: 'text',
  }),
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
