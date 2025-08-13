import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { NetworkBlock } from '@/blocks/NetworkBlock';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';

export const networkConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Pages',
  },
  fields: [
    fieldLinkablePage,
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
                  blocks: [NetworkBlock],
                  label: 'Network items',
                  minRows: 1,
                  name: 'items',
                  required: true,
                  type: 'blocks',
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
  slug: 'network',
};
