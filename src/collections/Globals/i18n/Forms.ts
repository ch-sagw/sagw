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
      fields: [
        {
          admin: {
            description: 'You may show this text in a checkbox on forms.',
          },
          fields: [
            rte2({
              name: 'dataPrivacyCheckboxText',
              required: true,
            }),
            {
              localized: true,
              name: 'errorMessage',
              required: true,
              type: 'text',
            },
          ],
          label: '',
          name: 'dataPrivacyCheckbox',
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
            description: 'This is the text which is shown if a newsletter form was successfully submitted. Only relevant if you want to add newsletter forms.',
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
          label: 'Newsletter Submit Success',
          name: 'newsletterSubmitSuccess',
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
      ],
      interfaceName: 'InterfaceI18nForms',
      name: 'i18nForms',
      type: 'group',
    },
  ],
  slug: 'i18nForms',
  versions,
};
