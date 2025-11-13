import { Field } from 'payload';
import {
  rte1, rte2,
} from './rte';
import { fieldInternalLinkChooser } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';

interface InterfaceLinkProps {
  showDescription?: boolean;
  hideLinkText?: boolean;
  optional?: boolean;
}

export const fieldsLinkInternal = (props?: InterfaceLinkProps): Field[] => {
  const linkFields: Field[] = [
    rte2({
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
      name: 'description',
      notRequired: true,
    }));
  }

  return linkFields;
};

export const fieldsLinkExternal = (props?: InterfaceLinkProps): Field[] => {
  const linkFields: Field[] = [
    {
      localized: true,
      name: 'externalLink',
      required: true,
      type: 'text',
      validate: (value: unknown): true | string => {
        if (typeof value !== 'string' || value.trim() === '') {
          return 'External link is required.';
        }

        const pattern = /^(?:https?:\/\/)?(?:www\.)+[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:[/?#].*)?$/u;

        if (pattern.test(value)) {
          return true;
        }

        return 'The URL has an invalid format. The URL must have a format like https://www.google.com or www.google.com.';
      },
    },
  ];

  if (!props?.hideLinkText) {
    linkFields.unshift(rte2({
      name: 'externalLinkText',
    }));
  }

  if (props?.showDescription) {
    linkFields.unshift(rte2({
      name: 'description',
      notRequired: true,
    }));
  }

  return linkFields;
};

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

export const fieldsLinkInternalOrExternal = (props?: InterfaceLinkProps): Field[] => [
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

