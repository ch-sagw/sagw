import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const MagazineOverviewPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Activities Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Magazine Page'),
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
  labels: {
    plural: 'Magazine Overview',
    singular: 'Magazine Overview',
  },
  slug: 'magazineOverview',
};
