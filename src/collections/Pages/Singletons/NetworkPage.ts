import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsNetworkItem } from '@/field-templates/networkItem';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';

export const NetworkPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Network Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),

            // Filter
            {
              fields: [
                {
                  localized: true,
                  name: 'allCheckboxText',
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
              label: 'Filter',
              name: 'filter',
              type: 'group',
            },

            // Network items
            {
              fields: [
                {
                  localized: true,
                  name: 'foundingYearText',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'linkText',
                  required: true,
                  type: 'text',
                },
                {
                  fields: fieldsNetworkItem,
                  label: 'Network items',
                  name: 'items',
                  required: true,
                  type: 'array',
                },
              ],
              label: 'Network items',
              name: 'items',
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
  hooks: {
    beforeChange: [hookSeoFallback],
  },
  labels: {
    plural: 'Network',
    singular: 'Network',
  },
  slug: 'network',
};
