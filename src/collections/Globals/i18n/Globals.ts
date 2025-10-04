import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

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
      ],
      type: 'tabs',
    },
  ],
  slug: 'i18nGlobals',
  versions,
};
