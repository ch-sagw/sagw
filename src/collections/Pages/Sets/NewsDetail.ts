import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHeroNewsDetail } from '@/field-templates/hero';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
import { genericPageHooks } from '@/hooks-payload/genericPageHooks';
import { genericPageFields } from '@/field-templates/genericPageFields';

const contentBlocks = [
  'textBlock',
  'linksBlock',
  'downloadsBlock',
  'imageBlock',
  'formBlock',
  'notificationBlock',
  'newsTeasersBlock',
] as const;

type ContentBlock = typeof contentBlocks[number];

const uniqueBlocks: ContentBlock[] = [
  'downloadsBlock',
  'linksBlock',
  'newsTeasersBlock',
];

export const NewsDetailPage: CollectionConfig = {
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
    ...genericPageFields(),
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
                    description: 'This text will be used as text for the teasers on the overview page.',
                  },
                  ...rte1({
                    name: 'teaserText',
                  }),
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Hero
            fieldsHeroNewsDetail,

            {
              name: 'project',
              relationTo: 'projects',
              required: false,
              type: 'relationship',
            },

            // Content Blocks
            {
              blocks: blocks(contentBlocks),
              filterOptions: excludeBlocksFilterSingle({
                allBlockTypes: contentBlocks,
                onlyAllowedOnceBlockTypes: uniqueBlocks,
              }),
              label: 'Content',
              name: 'content',
              type: 'blocks',
              validate: validateUniqueBlocksSingle({
                onlyAllowedOnceBlockTypes: uniqueBlocks,
              }),
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
  hooks: genericPageHooks(),
  labels: {
    plural: 'News Detail Pages',
    singular: 'News Detail',
  },
  slug: 'newsDetailPage',
  versions,
};
