import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsColorMode } from '@/field-templates/colorMode';

export const institutesConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Promotion Pages',
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: true,
      name: 'isLinkable',
      type: 'checkbox',
    },
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                ...fieldsColorMode,
              ],
              label: 'Hero',
              name: 'hero',
              type: 'group',
            },

            // Teasers
            {
              fields: [
                {
                  localized: true,
                  name: 'teaserLinkText',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Teasers',
              name: 'teasers',
              type: 'group',
            },

          ],
          label: 'Content',
        },

        // Meta Tabs
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  slug: 'institutes',
};
