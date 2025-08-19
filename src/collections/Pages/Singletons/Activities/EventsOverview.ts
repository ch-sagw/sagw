import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const EventsOverviewPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Activities Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Events Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),

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
  labels: {
    plural: 'Events Overview',
    singular: 'Events Overview',
  },
  slug: 'eventsOverview',
};
