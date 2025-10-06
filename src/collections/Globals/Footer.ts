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
      name: 'Data privacy link text',
      required: true,
    }),
    rte1({
      name: 'Impressum link text',
      required: true,
    }),
    rte1({
      disableLocalization: true,
      name: 'copyright',
      required: true,
    }),

    {
      fields: [
        rte1({
          name: 'title',
          required: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'address1',
          required: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'address2',
          required: false,
        }),
        rte1({
          disableLocalization: true,
          name: 'poBox',
          required: false,
        }),
        rte1({
          disableLocalization: true,
          name: 'countryCode',
          required: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'zipCode',
          required: true,
        }),
        rte1({
          name: 'city',
          required: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'phone',
          required: false,
        }),
        rte1({
          disableLocalization: true,
          name: 'mail',
          required: false,
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
