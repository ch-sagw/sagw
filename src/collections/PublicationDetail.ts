import {
  CollectionBeforeValidateHook, CollectionConfig,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/TextBlock';

const syncHeroTitleToTopLevel: CollectionBeforeValidateHook = ({
  data,
}) => {
  if (data?.hero?.title) {
    data.title = data.hero.title;
  }

  return data;
};

export const PublicationDetailConfig: CollectionConfig = {
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
    beforeChange: [syncHeroTitleToTopLevel],
  },
  labels: {
    plural: 'Publication Detail Pages',
    singular: 'Publication Detail',
  },
  slug: 'publicationDetail',
};
