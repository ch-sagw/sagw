import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';

export const publicationsOverviewConfig: GlobalConfig = {
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

            // Filters
            {
              fields: [
                {
                  localized: true,
                  name: 'allCheckboxTopics',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'allCheckboxTypes',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Filters',
              name: 'filters',
              type: 'group',
            },

            // Publication Detail
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
                  name: 'otherPublicationsTitle',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'otherPublicationsAllButton',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Publication Detail',
              name: 'publicationDetail',
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
  slug: 'publicationsOverview',
};
