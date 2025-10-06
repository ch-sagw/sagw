import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import {
  rte1, rte3,
} from '@/field-templates/rte';

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
              ...rte1({
                name: 'downloadTitle',
                required: true,
              }),
            },
            {
              admin: {
                description: 'If you add a CTA-Contact-Block, this will be used as the button text',
              },
              ...rte1({
                name: 'writeEmailButtonText',
                required: true,
              }),
            },
            {
              admin: {
                description: 'On magazine detail pages, we use this to show the "Copy Text" button',
              },
              ...rte1({
                name: 'exportArticleButtonText',
                required: true,
              }),
            },
          ],
          name: 'generic',
        },
        {
          fields: [
            rte1({
              name: 'title',
              required: true,
            }),
            rte1({
              name: 'copyButtonText',
              required: true,
            }),
          ],
          name: 'bibliographicReference',
        },
        {
          fields: [
            {
              admin: {
                description: 'You may show this text in a checkbox on forms.',
                hideGutter: true,
              },
              fields: [
                rte3({
                  name: 'dataPrivacyCheckboxText',
                  required: true,
                }),
                rte1({
                  name: 'errorMessage',
                  required: true,
                }),
              ],
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
