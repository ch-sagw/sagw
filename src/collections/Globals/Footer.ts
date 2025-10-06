import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';

const fieldsSocialLink: Field[] = [
  ...fieldsLinkExternal,
  {
    name: 'icon',
    options: [
      {
        label: 'LinkedIn',
        value: 'linkedIn',
      },
      {
        label: 'Intagram',
        value: 'instagram',
      },
      {
        label: 'Facebook',
        value: 'facebook',
      },
      {
        label: 'X (Twitter)',
        value: 'twitter',
      },
    ],
    type: 'select',
  },
];

export const Footer: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldAdminTitleDefaultValue('Footer'),

    rte1({
      name: 'legal',
    }),
    rte1({
      name: 'impressum',
    }),
    rte1({
      disableLocalization: true,
      name: 'copyright',
    }),

    {
      fields: [
        rte1({
          name: 'title',
        }),
        rte1({
          disableLocalization: true,
          name: 'address1',
        }),
        rte1({
          disableLocalization: true,
          name: 'address2',
          notRequired: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'poBox',
          notRequired: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'countryCode',
        }),
        rte1({
          disableLocalization: true,
          name: 'zipCode',
        }),
        rte1({
          name: 'city',
        }),
        rte1({
          disableLocalization: true,
          name: 'phone',
          notRequired: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'mail',
          notRequired: true,
        }),
      ],
      label: 'Kontakt',
      name: 'contact',
      type: 'group',
    },
    {
      fields: fieldsSocialLink,
      name: 'socialLinks',
      required: false,
      type: 'array',
    },
  ],
  labels: {
    plural: 'Footer',
    singular: 'Footer',
  },
  slug: 'footer',
  versions,
};
