import { CollectionConfig } from 'payload';
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
              ...rte1({
                adminDescription: 'If you add a Download-Block, this will be used as a title',
                name: 'downloadTitle',
              }),
            },
            {
              ...rte1({
                adminDescription: 'If you add a Link-Block, this will be used as a title',
                name: 'linksTitle',
              }),
            },
            {
              ...rte1({
                adminDescription: 'If you add a CTA-Contact-Block, this will be used as the button text',
                name: 'writeEmailButtonText',
              }),
            },
            {
              ...rte1({
                adminDescription: 'On magazine detail pages, we use this to show the "Copy Text" button',
                name: 'exportArticleButtonText',
              }),
            },
            {
              ...rte1({
                adminDescription: 'On events, we use this to display the time. If you provide the value "Uhr", we display: "09:00 Uhr"',
                name: 'time',
              }),
            },
          ],
          interfaceName: 'InterfaceI18nGeneric',
          name: 'generic',
        },
        {
          fields: [
            rte1({
              name: 'title',
            }),
            rte1({
              name: 'copyButtonText',
            }),
          ],
          interfaceName: 'InterfaceI18nBibliographicReference',
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
                }),
                rte1({
                  name: 'errorMessage',
                }),
              ],
              name: 'dataPrivacyCheckbox',
              type: 'group',
            },
          ],
          interfaceName: 'InterfaceI18nForms',
          name: 'forms',
        },
      ],
      type: 'tabs',
    },
  ],
  slug: 'i18nGlobals',
};
