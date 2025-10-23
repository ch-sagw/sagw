import { Field } from 'payload';
import { rte1 } from './rte';

export const fieldsLinkInternal: Field[] = [
  rte1({
    name: 'description',
    notRequired: true,
  }),
  rte1({
    name: 'linkText',
  }),
  {
    admin: {
      components: {
        Field: {
          path: '@/components/admin/InternalLinkChooser/InternalLinkChooser',
        },
      },
    },
    name: 'internalLink',
    required: true,
    type: 'text',
  },
];

export const fieldsLinkExternal: Field[] = [
  rte1({
    name: 'description',
    notRequired: true,
  }),
  rte1({
    name: 'externalLinkText',
  }),
  {
    name: 'externalLink',
    required: true,
    type: 'text',
    validate: (value: unknown): true | string => {
      if (typeof value !== 'string' || value.trim() === '') {
        return 'External link is required.';
      }

      const pattern = /^(?:https?:\/\/)?(?:www\.)+[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/u;

      if (pattern.test(value)) {
        return true;
      }

      return 'The URL has an invalid format. The URL must have a format like https://www.google.com or www.google.com.';
    },
  },
];

export const fieldsMail: Field[] = [
  rte1({
    name: 'linkText',
  }),
  {
    localized: false,
    name: 'email',
    required: true,
    type: 'email',
  },
];

export const fieldsLinkInternalOrExternal: Field[] = [
  {
    admin: {
      layout: 'horizontal',
    },
    defaultValue: 'internal',
    name: 'linkType',
    options: [
      {
        label: 'Internal',
        value: 'internal',
      },
      {
        label: 'External',
        value: 'external',
      },
      {
        label: 'E-Mail',
        value: 'mail',
      },
    ],
    required: true,
    type: 'radio',
  },
  {
    admin: {
      condition: (data, siblingData) => siblingData.linkType === 'internal',
    },
    fields: fieldsLinkInternal,
    name: 'linkInternal',
    type: 'group',
  },
  {
    admin: {
      condition: (data, siblingData) => siblingData.linkType === 'external',
    },
    fields: fieldsLinkExternal,
    name: 'linkExternal',
    type: 'group',
  },
  {
    admin: {
      condition: (data, siblingData) => siblingData.linkType === 'mail',
    },
    fields: fieldsMail,
    name: 'linkMail',
    type: 'group',
  },
];

export const fieldsLinkInternalWithToggle: Field = {
  fields: [
    {
      defaultValue: false,
      label: 'Include Link',
      name: 'includeLink',
      type: 'checkbox',
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData?.includeLink === true,
      },
      fields: fieldsLinkInternal,
      name: 'link',
      type: 'group',
    },
  ],
  name: 'optionalLink',
  type: 'group',
};

