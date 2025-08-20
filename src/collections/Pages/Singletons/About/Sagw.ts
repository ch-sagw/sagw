import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/TextBlock';
import { ImageBlock } from '@/blocks/ImageBlock';
import { VideoBlock } from '@/blocks/VideoBlock';
import { LinkExternal } from '@/blocks/LinkExternal';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const AboutSagwPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'About Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('About SAGW Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

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

            // Links
            {
              fields: [
                {
                  localized: true,
                  name: 'linksTitle',
                  required: true,
                  type: 'text',
                },
                {
                  fields: LinkExternal.fields,
                  name: 'link',
                  required: true,
                  type: 'array',
                },
              ],
              label: 'Links',
              name: 'linksGroup',
              type: 'group',
            },

            // Downloads
            {
              fields: [
                {
                  localized: true,
                  name: 'downloadsTitle',
                  required: true,
                  type: 'text',
                },
                {
                  hasMany: true,
                  name: 'downloads',
                  relationTo: 'documents',
                  required: false,
                  type: 'relationship',
                },
                {
                  hasMany: true,
                  name: 'zenodoDownloads',
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
  labels: {
    plural: 'About SAGW',
    singular: 'About SAGW',
  },
  slug: 'aboutSagw',
};
