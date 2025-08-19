import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';

export const ErrorPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Pages',
  },
  fields: [
    {
      tabs: [

        // Content Tab
        {
          fields: [

            {
              localized: true,
              name: 'homeButtonText',
              required: true,
              type: 'text',
            },

            // 404
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
                  name: 'description',
                  required: true,
                  type: 'text',
                },
              ],
              label: '404',
              name: 'notFound',
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
    plural: 'Error Page',
    singular: 'Error Page',
  },
  slug: 'errorPage',
};
