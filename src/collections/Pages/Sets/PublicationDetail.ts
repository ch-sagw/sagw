import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsTextBlock } from '@/field-templates/textBlock';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';

export const PublicationDetailPage: CollectionConfig = {
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
                  name: 'topic',
                  relationTo: 'publicationTopics',
                  required: true,
                  type: 'relationship',
                },
                {
                  name: 'type',
                  relationTo: 'publicationTypes',
                  required: true,
                  type: 'relationship',
                },
              ],
              label: 'Categorization',
              name: 'categorization',
              type: 'group',
            },

            // Hero
            fieldsHero(),

            // Text blocks
            {
              fields: fieldsTextBlock,
              label: 'Content Blocks',
              name: 'contentBlocks',
              required: true,
              type: 'array',
            },

            // authors
            {
              fields: [
                {
                  localized: false,
                  name: 'author',
                  required: false,
                  type: 'text',
                },
              ],
              label: 'Authors',
              minRows: 0,
              name: 'authors',
              type: 'array',
            },

            // Downloads

            {
              fields: [
                {
                  hasMany: true,
                  name: 'downloads',
                  relationTo: 'zenodoDocuments',
                  required: false,
                  type: 'relationship',
                },
              ],
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
    beforeValidate: [hookAdminTitle],
  },
  labels: {
    plural: 'Publication Detail Pages',
    singular: 'Publication Detail',
  },
  slug: 'publicationDetailPage',
};
