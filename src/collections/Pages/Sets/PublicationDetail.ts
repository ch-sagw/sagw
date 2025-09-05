import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';
import { blocks } from '@/blocks';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { versions } from '@/field-templates/versions';
import { fieldSlug } from '@/field-templates/slug';
import { hookSlug } from '@/hooks/slug';

export const PublicationDetailPage: CollectionConfig = {
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
                    description: 'This image will be used for the teasers on the overview page.',
                  },
                  name: 'image',
                  relationTo: 'images',
                  required: true,
                  type: 'relationship',
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Categorization
            {
              fields: [
                {
                  fields: [
                    {
                      admin: {
                        width: '50%',
                      },
                      name: 'topic',
                      relationTo: 'publicationTopics',
                      required: true,
                      type: 'relationship',
                    },
                    {
                      admin: {
                        width: '50%',
                      },
                      name: 'type',
                      relationTo: 'publicationTypes',
                      required: true,
                      type: 'relationship',
                    },
                  ],
                  type: 'row',
                },
              ],
              label: 'Categorization',
              name: 'categorization',
              type: 'group',
            },

            // Hero
            fieldsHero([...fieldsColorMode]),

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
    beforeValidate: [
      hookAdminTitle,
      hookSlug,
    ],
  },
  labels: {
    plural: 'Publication Detail Pages',
    singular: 'Publication Detail',
  },
  slug: 'publicationDetailPage',
  versions,
};
