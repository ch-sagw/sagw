import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { rte2 } from '@/field-templates/rte';

export const I18nGlobals: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'i18n',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            {
              admin: {
                description: 'If you add a Download-Block, this will be used as a title',
              },
              localized: true,
              name: 'downloadTitle',
              required: true,
              type: 'text',
            },
            {
              admin: {
                description: 'If you add a CTA-Contact-Block, this will be used as the button text',
              },
              localized: true,
              name: 'writeEmailButtonText',
              required: true,
              type: 'text',
            },
            {
              admin: {
                description: 'On magazine detail pages, we use this to show the "Copy Text" button',
              },
              localized: true,
              name: 'exportArticleButtonText',
              required: true,
              type: 'text',
            },
          ],
          name: 'generic',
        },
        {
          fields: [
            {
              localized: true,
              name: 'title',
              required: true,
              type: 'text',
            },
            {
              localized: true,
              name: 'copyButtonText',
              required: true,
              type: 'text',
            },
          ],
          name: 'bibliographicReference',
        },
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
          name: 'forms',
        },
      ],
      type: 'tabs',
    },
  ],
  slug: 'i18nGlobals',
  versions,
};
