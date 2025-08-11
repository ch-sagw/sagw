import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

export const InstituteDetailConfig: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Pages',
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
                  relationTo: 'images',
                  required: true,
                  type: 'relationship',
                },
                ...fieldsLinkInternalOrExternal,
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
  labels: {
    plural: 'Institute Detail Pages',
    singular: 'Institute Detail',
  },
  slug: 'instituteDetail',
};
