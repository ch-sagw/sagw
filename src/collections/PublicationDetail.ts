import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/TextBlock';

export const PublicationDetailConfig: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Pages',
  },
  fields: [
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
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Hero',
              name: 'hero',
              type: 'group',
            },

            // Text blocks
            {
              blocks: [TextBlock],
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
                  required: true,
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
  slug: 'publicationDetail',
};
