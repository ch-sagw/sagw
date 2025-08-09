import {
  CollectionSlug, Field,
} from 'payload';

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

export const fieldsLinkInternal = (relationTo: CollectionSlug): Field[] => [
  {
    localized: true,
    name: 'linkText',
    required: true,
    type: 'text',
  },
  {
    name: 'slug',
    relationTo,
    required: true,
    type: 'relationship',
  },
  {
    defaultValue: false,
    label: 'In neuem Fenster öffnen',
    name: 'openInNewWindow',
    type: 'checkbox',
  },
];

export const fieldsLinkInternalWithToggle = (relationTo: CollectionSlug): Field => ({
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
      fields: fieldsLinkInternal(relationTo),
      name: 'link',
      type: 'group',
    },
  ],
  name: 'optionalLink',
  type: 'group',
});

export const fieldsLinkInternalOrExternal = (relationTo: CollectionSlug): Field[] => [
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
    fields: fieldsLinkInternal(relationTo),
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
