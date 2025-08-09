import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';

export const newsOverviewConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Activities Pages',
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
              ],
              label: 'Hero',
              name: 'hero',
              type: 'group',
            },

            // Detail Page Properties
            {
              fields: [
                {
                  localized: true,
                  name: 'downloadsTitle',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'linksTitle',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'otherNewsTitle',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Detail Page Properties',
              name: 'detailPageProps',
              type: 'group',
            },

            // Content
            {
              fields: [
                {
                  localized: true,
                  name: 'sectionTitle',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Content',
              name: 'content',
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
  slug: 'newsOverview',
};
