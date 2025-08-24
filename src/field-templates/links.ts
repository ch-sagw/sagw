import { Field } from 'payload';

export const fieldsLinkInternal: Field[] = [
  {
    defaultValue: false,
    label: 'In neuem Fenster öffnen',
    name: 'openInNewWindow',
    type: 'checkbox',
  },
  {
    localized: true,
    name: 'linkText',
    required: true,
    type: 'text',
  },
  {
    admin: {
      components: {
        Field: {
          path: 'src/components/admin/InternalLinkChooser/InternalLinkChooser',
        },
      },
    },
    name: 'internalLink',
    type: 'text',
  },
];

export const fieldsLinkExternal: Field[] = [
  {
    localized: true,
    name: 'externalLinkText',
    required: true,
    type: 'text',
  },
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
];
