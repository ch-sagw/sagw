import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';

export const newsOverviewConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Activities Pages',
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
            fieldsHero(),

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
