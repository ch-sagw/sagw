import {
  CollectionBeforeValidateHook, CollectionConfig,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { LinkExternal } from '@/blocks/LinkExternal';
import { TextBlock } from '@/blocks/TextBlock';
import { ImageBlock } from '@/blocks/ImageBlock';
import { VideoBlock } from '@/blocks/VideoBlock';

const syncHeroTitleToTopLevel: CollectionBeforeValidateHook = ({
  data,
}) => {
  if (data?.hero?.title) {
    data.title = data.hero.title;
  }

  return data;
};

export const NewsDetailConfig: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Pages',
    useAsTitle: 'title',
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      name: 'title',
      type: 'text',
    },
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
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  name: 'date',
                  required: true,
                  type: 'date',
                },
              ],
              label: 'Hero',
              name: 'hero',
              type: 'group',
            },

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
  hooks: {
    beforeChange: [syncHeroTitleToTopLevel],
  },
  labels: {
    plural: 'News Detail Pages',
    singular: 'News Detail',
  },
  slug: 'newsDetail',
};
