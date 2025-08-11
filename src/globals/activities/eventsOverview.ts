import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';

export const eventsOverviewConfig: GlobalConfig = {
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

            // Events
            {
              fields: [
                {
                  localized: true,
                  name: 'sectionTitle',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Events',
              name: 'events',
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
  slug: 'eventsOverview',
};
