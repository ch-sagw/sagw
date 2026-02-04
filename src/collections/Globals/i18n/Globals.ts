import { CollectionConfig } from 'payload';
import {
  rte1, rte3,
} from '@/field-templates/rte';
import { globalContentAccessNoTranslatorNoEditor } from '@/access/globalContent';
import { hookInvalidateCacheOnI18nGlobalsChange } from '@/hooks-payload/invalidateCacheOnI18nGlobalsChange';

export const I18nGlobals: CollectionConfig = {
  access: globalContentAccessNoTranslatorNoEditor,
  admin: {
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            {
              ...rte1({
                adminDescription: 'If you add a Download-Block, this will be used as a title',
                label: 'Downloads Block Title',
                name: 'downloadTitle',
              }),
            },
            {
              ...rte1({
                adminDescription: 'If you add a Link-Block, this will be used as a title',
                label: 'Links Block Title',
                name: 'linksTitle',
              }),
            },
            {
              ...rte1({
                adminDescription: 'If you add a personal contact block, this text will be shown in the Email button',
                label: '"Write Email" Button',
                name: 'writeEmailButtonText',
              }),
            },
            {
              ...rte1({
                adminDescription: 'On magazine detail pages, this text appears in the button that enables the user to export the article as a PDF file.',
                label: '"Export Article" Button',
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
              adminDescription: 'The text appears in the button that enables the user to copy the bibliographic reference with one click.',
              label: '"Copy Text" Button',
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
                  adminDescription: 'The message appears on forms if the user has not agreed to the data privacy policy.',
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
  hooks: {
    afterChange: [hookInvalidateCacheOnI18nGlobalsChange],
  },
  labels: {
    plural: 'Content Snippets',
    singular: 'Content Snippets',
  },
  slug: 'i18nGlobals',
};
