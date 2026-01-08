import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHeroNewsDetail } from '@/field-templates/hero';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import {
  blocks, BlockSlug,
} from '@/blocks';
import { versions } from '@/field-templates/versions';
import { rte2 } from '@/field-templates/rte';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
import { genericPageHooks } from '@/hooks-payload/genericPageHooks';
import { genericPageFields } from '@/field-templates/genericPageFields';
import { pageAccess } from '@/access/pages';
import { allBlocksButTranslator } from '@/access/blocks';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

const contentBlocks: BlockSlug[] = [
  'textBlock',
  'linksBlock',
  'downloadsBlock',
  'imageBlock',
  'formBlock',
  'notificationBlock',
  'newsTeasersBlock',
];

const uniqueBlocks: BlockSlug[] = [
  'downloadsBlock',
  'linksBlock',
  'newsTeasersBlock',
];

export const NewsDetailPage: CollectionConfig = {
  access: pageAccess,
  admin: {
    defaultColumns: [
      'adminTitle',
      'slug',
      'updatedAt',
      '_status',
    ],
    group: 'Pages',
    hideAPIURL: process.env.ENV === 'prod',
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
                  ...rte2({
                    adminDescription: 'This text will be used as text for the teasers on the overview page.',
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
              access: fieldAccessNonLocalizableField,
              name: 'project',
              relationTo: 'projects',
              required: false,
              type: 'relationship',
            },

            // Content Blocks
            {
              blocks: blocks(contentBlocks),
              filterOptions: ({
                siblingData, req,
              }): BlockSlug[] => {
                const onlyOnceBlockFilter = excludeBlocksFilterSingle({
                  allBlockTypes: contentBlocks,
                  onlyAllowedOnceBlockTypes: uniqueBlocks,
                })({
                  siblingData,
                });

                return allBlocksButTranslator({
                  allBlocks: onlyOnceBlockFilter,
                  req,
                });
              },
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
  hooks: genericPageHooks({
    afterChange: [],
  }),
  labels: {
    plural: 'News Detail Pages',
    singular: 'News Detail',
  },
  slug: 'newsDetailPage',
  versions,
};
