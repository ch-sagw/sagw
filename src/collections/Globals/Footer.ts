import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { versions } from '@/field-templates/versions';

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
    {
      label: 'Datenschutz',
      localized: true,
      name: 'legal',
      required: true,
      type: 'text',
    },
    {
      label: 'Impressum',
      localized: true,
      name: 'impressum',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'copyright',
      required: true,
      type: 'text',
    },
    {
      fields: [
        {
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          name: 'address1',
          required: true,
          type: 'text',
        },
        {
          name: 'address2',
          required: false,
          type: 'text',
        },
        {
          name: 'poBox',
          required: false,
          type: 'text',
        },
        {
          name: 'countryCode',
          required: true,
          type: 'text',
        },
        {
          name: 'zipCode',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'city',
          required: true,
          type: 'text',
        },
        {
          name: 'phone',
          required: false,
          type: 'text',
        },
        {
          name: 'mail',
          required: false,
          type: 'email',
        },
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
