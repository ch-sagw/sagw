import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/TextBlock';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const PublicationDetailConfig: CollectionConfig = {
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
              blocks: [TextBlock],
              label: 'Content Blocks',
              name: 'contentBlocks',
              type: 'blocks',
            },

            // TODO: add blocks for authors

            // Downloads

            // Remove downloads
            //  -> textfield for Zenodo id
            //  ->
            {
              fields: [
                {
                  hasMany: true,
                  name: 'downloads',
                  relationTo: 'documents',
                  required: false,
                  type: 'relationship',
                },
              ],
              label: 'Downloads',
              name: 'downloads',
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
    beforeValidate: [hookAdminTitle],
  },
  labels: {
    plural: 'Publication Detail Pages',
    singular: 'Publication Detail',
  },
  slug: 'publicationDetail',
};
