import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

export const instituteDetailConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Promotion Pages',
  },
  fields: [
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

            // Institute Details
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
                  name: 'text',
                  required: true,
                  type: 'text',
                },
                {
                  name: 'logo',
                  relationTo: 'media',
                  required: true,
                  type: 'relationship',
                },
                ...fieldsLinkInternalOrExternal('pages'),
              ],
              label: 'Institute Details',
              name: 'instituteDetails',
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
  slug: 'instituteDetail',
};
