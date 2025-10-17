import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHeroNewsDetail } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks-payload/seoFallback';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';
import { hookFormsBlockOnCreate } from '@/hooks-payload/formsBlockOnCreate';
import { fieldSlug } from '@/field-templates/slug';
import { hookSlug } from '@/hooks-payload/slug';
import { rte1 } from '@/field-templates/rte';

export const NewsDetailPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    defaultColumns: [
      'adminTitle',
      'slug',
      'updatedAt',
      '_status',
    ],
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitle,
    fieldSlug,
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
                  ...rte1({
                    name: 'teaserText',
                  }),
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Hero
            fieldsHeroNewsDetail,

            {
              name: 'project',
              relationTo: 'projects',
              required: false,
              type: 'relationship',
            },

            // Content Blocks
            {
              blocks: blocks([
                'textBlock',
                'linksBlock',
                'downloadsBlock',
                'imageBlock',
                'formBlock',
                'notificationBlock',
                'newsTeasersBlock',
              ]),
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
    beforeValidate: [
      hookAdminTitle,
      hookFormsBlockOnCreate,
      hookSlug,
    ],
  },
  labels: {
    plural: 'News Detail Pages',
    singular: 'News Detail',
  },
  slug: 'newsDetailPage',
  versions,
};
