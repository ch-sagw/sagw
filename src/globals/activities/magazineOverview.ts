import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';

export const magazineOverviewConfig: GlobalConfig = {
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

            // Magazine Detail Page properties
            {
              fields: [
                {
                  localized: true,
                  name: 'heroExportButtonText',
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
                  name: 'subscribeButtonText',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'downloadsTitle',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'downloadsText',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Magazine Detail Page properties',
              name: 'magazineDetailPageProps',
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
  slug: 'magazineOverview',
};
