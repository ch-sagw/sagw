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
      ],
      interfaceName: 'InterfaceI18nForms',
      name: 'i18nForms',
      type: 'group',
    },
  ],
  slug: 'i18nForms',
  versions,
};
