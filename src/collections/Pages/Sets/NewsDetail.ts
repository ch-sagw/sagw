import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import { hookAdminTitle } from '@/hooks/adminTitle';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';
import { blocks } from '@/blocks';

export const NewsDetailPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitle,
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Overview Page properties
            {
              fields: [
                {
                  admin: {
                    description: 'This text will be used as text for the teasers on the overview page.',
                  },
                  localized: true,
                  name: 'teaserText',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Hero
            fieldsHero([
              {
                name: 'date',
                required: true,
                type: 'date',
              },
            ]),

            // Content Blocks
            {
              blocks: blocks(),
              label: 'Content',
              name: 'content',
              type: 'blocks',
            },

          ],
          label: 'Content',
        },

        // Meta Tab
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  hooks: {
    beforeChange: [hookSeoFallback],
    beforeValidate: [hookAdminTitle],
  },
  labels: {
    plural: 'News Detail Pages',
    singular: 'News Detail',
  },
  slug: 'newsDetailPage',
};
