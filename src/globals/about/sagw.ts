import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/TextBlock';
import { ImageBlock } from '@/blocks/ImageBlock';
import { VideoBlock } from '@/blocks/VideoBlock';
import { LinkExternal } from '@/blocks/LinkExternal';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';

export const aboutSagwConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'About Pages',
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
                  blocks: [LinkExternal],
                  minRows: 0,
                  name: 'link',
                  type: 'blocks',
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
                  required: true,
                  type: 'relationship',
                },
              ],

              // TODO:
              // enable Zenodo (both optional)
              label: 'Downloads',
              name: 'downloadsGroup',
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
  slug: 'aboutSagw',
};
