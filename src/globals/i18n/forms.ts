import {
  Field, GlobalConfig,
} from 'payload';

const inputFields: Field[] = [
  {
    localized: true,
    name: 'label',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'placeholder',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'error',
    required: true,
    type: 'text',
  },
];

export const i18nFormsConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'i18n',
  },
  fields: [
    {
      fields: [
        {
          fields: inputFields,
          label: 'E-Mail',
          name: 'email',
          type: 'group',
        },
        {
          fields: inputFields,
          label: 'Message',
          name: 'message',
          type: 'group',
        },
        {
          fields: inputFields,
          label: 'Name',
          name: 'name',
          type: 'group',
        },
      ],
      label: 'Input Fields',
      name: 'inputFields',
      type: 'group',
    },

    {
      fields: [
        {
          localized: true,
          name: 'dataPrivacyCheckboxText',
          required: true,
          type: 'richText',
        },
      ],
      label: 'Checkboxes',
      name: 'checkboxes',
      type: 'group',
    },
  ],
  slug: 'i18nForms',
};
