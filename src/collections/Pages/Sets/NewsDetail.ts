import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { LinkExternal } from '@/blocks/LinkExternal';
import { LinkInternal } from '@/blocks/LinkInternal';
import { TextBlock } from '@/blocks/TextBlock';
import { ImageBlock } from '@/blocks/ImageBlock';
import { VideoBlock } from '@/blocks/VideoBlock';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import { hookAdminTitle } from '@/hooks/adminTitle';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

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
            fieldsHero(),

            // Content
            {
              blocks: [
                TextBlock,
                ImageBlock,
                VideoBlock,
              ],
              label: 'Content Blocks',
              name: 'contentBlocks',
              type: 'blocks',
            },

            // Downloads

            // TODO: add Zenodo (both optional)
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

            // Links
            {
              blocks: [
                LinkExternal,
                LinkInternal,
              ],
              minRows: 0,
              name: 'links',
              type: 'blocks',
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
    plural: 'News Detail Pages',
    singular: 'News Detail',
  },
  slug: 'newsDetail',
};
