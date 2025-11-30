import { Field } from 'payload';
import {
  rte1, rte2,
} from './rte';
import { fieldInternalLinkChooser } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';
import {
  fieldAccessLocalizableField, fieldAccessNonLocalizableField,
} from '@/access/fields/localizedFields';

interface InterfaceLinkProps {
  showDescription?: boolean;
  hideLinkText?: boolean;
  optional?: boolean;
}

export const fieldsLinkInternal = (props?: InterfaceLinkProps): Field[] => {
  const linkFields: Field[] = [
    rte1({
      access: fieldAccessLocalizableField,
      name: 'linkText',
      notRequired: props?.optional,
    }),
    fieldInternalLinkChooser({
      name: 'internalLink',
      optional: props?.optional,
    }),
  ];

  if (props?.showDescription) {
    linkFields.unshift(rte2({
      access: fieldAccessLocalizableField,
      name: 'description',
      notRequired: true,
    }));
  }

  return linkFields;
};

export const fieldsLinkExternal = (props?: InterfaceLinkProps): Field[] => {
  const linkFields: Field[] = [
    {
      access: fieldAccessNonLocalizableField,
      localized: true,
      name: 'externalLink',
      required: true,
      type: 'text',
      validate: (value: unknown): true | string => {
        if (typeof value !== 'string' || value.trim() === '') {
          return 'External link is required.';
        }

        const pattern = /^(?:https?:\/\/(?:www\.)?|www\.)[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+(?:[/?#].*)?$/u;

        if (pattern.test(value)) {
          return true;
        }

        return 'The URL has an invalid format. The URL must have a format like https://www.google.com, https://google.com, or www.google.com.';
      },
    },
  ];

  if (!props?.hideLinkText) {
    linkFields.unshift(rte1({
      access: fieldAccessLocalizableField,
      name: 'externalLinkText',
    }));
  }

  if (props?.showDescription) {
    linkFields.unshift(rte2({
      access: fieldAccessLocalizableField,
      name: 'description',
      notRequired: true,
    }));
  }

  return linkFields;
};

export const fieldsMail: Field[] = [
  rte1({
    access: fieldAccessLocalizableField,
    name: 'linkText',
  }),
  {
    access: fieldAccessNonLocalizableField,
    localized: false,
    name: 'email',
    required: true,
    type: 'email',
  },
];

export const fieldsLinkInternalOrExternal = (props?: InterfaceLinkProps): Field[] => [
  {
    access: fieldAccessNonLocalizableField,
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
      condition: (_, siblingData) => siblingData.linkType === 'internal',
    },
    fields: fieldsLinkInternal(props),
    name: 'linkInternal',
    type: 'group',
  },
  {
    admin: {
      condition: (_, siblingData) => siblingData.linkType === 'external',
    },
    fields: fieldsLinkExternal(props),
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

export const fieldsLinkInternalWithToggle = (props?: InterfaceLinkProps): Field => ({
  fields: [
    {
      access: fieldAccessNonLocalizableField,
      defaultValue: false,
      label: 'Include Link',
      name: 'includeLink',
      type: 'checkbox',
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData?.includeLink === true,
      },
      fields: fieldsLinkInternal(props),
      name: 'link',
      type: 'group',
    },
  ],
  name: 'optionalLink',
  type: 'group',
});

