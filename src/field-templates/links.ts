import {
  Field,
  Option,
} from 'payload';

import {
  collectionPages, globalPages,
} from '@/config/availablePages';

const pages: Option[] = [];

collectionPages.forEach((page) => {
  pages.push({
    label: page,
    value: page,
  });
});

globalPages.forEach((page) => {
  pages.push(page);
});

const relationshipFields: Field[] = [];

collectionPages.forEach((page) => {
  relationshipFields.push({
    admin: {
      condition: (_, siblingData) => siblingData?.type === page,
    },
    name: `${page}Reference`,
    relationTo: page,
    required: true,
    type: 'relationship',
  });
});

export const fieldsLinkExternal: Field[] = [
  {
    localized: true,
    name: 'linkText',
    required: true,
    type: 'text',
  },
  {
    name: 'href',
    required: true,
    type: 'text',
  },
  {
    defaultValue: true,
    label: 'In neuem Fenster öffnen',
    name: 'openInNewWindow',
    type: 'checkbox',
  },
];

const fieldsLinkInternal: Field[] = [
  {
    localized: true,
    name: 'linkText',
    required: true,
    type: 'text',
  },
  {
    name: 'type',
    options: pages,
    required: true,
    type: 'select',
  },
  ...relationshipFields,
  {
    defaultValue: false,
    label: 'In neuem Fenster öffnen',
    name: 'openInNewWindow',
    type: 'checkbox',
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
