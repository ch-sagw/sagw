import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { LinkExternal } from '@/blocks/LinkExternal';
import { TextBlock } from '@/blocks/TextBlock';
import { ImageBlock } from '@/blocks/ImageBlock';
import { VideoBlock } from '@/blocks/VideoBlock';
import { fieldsHero } from '@/field-templates/hero';

export const NewsDetailConfig: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Pages',
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: true,
      name: 'isLinkable',
      type: 'checkbox',
    },
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

            // Todo: Internal & External
            {
              blocks: [LinkExternal],
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
  labels: {
    plural: 'News Detail Pages',
    singular: 'News Detail',
  },
  slug: 'newsDetail',
};
