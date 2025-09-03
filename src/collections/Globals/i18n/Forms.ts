import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { CollectionConfig } from 'payload';

import { rte2 } from '@/field-templates/rte';
import { versions } from '@/field-templates/versions';

export const I18nForms: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'i18n',
  },
  fields: [
    {
      admin: {
        description: 'You may show this text in a checkbox on forms.',
      },
      fields: [
        {
          editor: rte2,
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

    {
      admin: {
        description: 'This is the text which is shown if a form was successfully submitted.',
      },
      fields: [
        {
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'text',
          required: true,
          type: 'text',
        },
        fieldsLinkInternalWithToggle,
      ],
      label: 'Submit Success',
      name: 'submitSuccess',
      type: 'group',
    },

    {
      admin: {
        description: 'This is the text which is shown if there was an error submitting a form.',
      },
      fields: [
        {
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'text',
          required: true,
          type: 'text',
        },
        fieldsLinkInternalWithToggle,
      ],
      label: 'Submit Error',
      name: 'submitError',
      type: 'group',
    },

    {
      admin: {
        description: 'This is the text which is shown if there was an warning submitting a form.',
      },
      fields: [
        {
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'text',
          required: true,
          type: 'text',
        },
        fieldsLinkInternalWithToggle,
      ],
      label: 'Submit Warn',
      name: 'submitWarn',
      type: 'group',
    },
  ],
  slug: 'i18nForms',
  versions,
};
