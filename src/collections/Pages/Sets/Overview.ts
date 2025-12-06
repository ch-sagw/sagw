import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import {
  blocks, BlockSlug, OVERVIEW_BLOCK_TYPES,
} from '@/blocks';
import { versions } from '@/field-templates/versions';
import {
  excludeBlocksFilterCumulative, excludeBlocksFilterSingle,
} from '@/utilities/blockFilters';
import { validateUniqueBlocksCumulativeAndSingle } from '@/hooks-payload/validateUniqueBlocks';
import { genericPageHooks } from '@/hooks-payload/genericPageHooks';
import { genericPageFields } from '@/field-templates/genericPageFields';
import { pageAccess } from '@/access/pages';
import { sagwOnlyBlocks } from '@/access/blocks';

const contentBlocks: BlockSlug[] = [
  'textBlock',
  'accordionBlock',
  'formBlock',
  'ctaContactBlock',
  'notificationBlock',
  'networkTeasersBlock',
  'genericTeasersBlock',
  'projectsOverviewBlock',
  'magazineOverviewBlock',
  'publicationsOverviewBlock',
  'eventsOverviewBlock',
  'peopleOverviewBlock',
  'newsOverviewBlock',
  'institutesOverviewBlock',
  'nationalDictionariesOverviewBlock',
  'projectsTeasersBlock',
  'eventsTeasersBlock',
  'magazineTeasersBlock',
  'newsTeasersBlock',
  'publicationsTeasersBlock',
  'editionsOverview',
];

const uniqueBlocks: BlockSlug[] = [
  'projectsTeasersBlock',
  'eventsTeasersBlock',
  'magazineTeasersBlock',
  'newsTeasersBlock',
  'publicationsTeasersBlock',
];

export const OverviewPage: CollectionConfig = {
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

            // Hero
            fieldsHero,

            // Content Blocks
            {
              blocks: blocks(contentBlocks),
              filterOptions: async ({
                siblingData,
                req,
              }): Promise<BlockSlug[]> => {
                const onlyOnceBlockFilterCumulative = excludeBlocksFilterCumulative({
                  allBlockTypes: contentBlocks,
                  onlyAllowedOnceBlockTypes: OVERVIEW_BLOCK_TYPES,
                })({
                  siblingData,
                });

                const showBlocks = await sagwOnlyBlocks({
                  allBlocks: onlyOnceBlockFilterCumulative,
                  req,
                  restrictedBlocks: [
                    'nationalDictionariesOverviewBlock',
                    'institutesOverviewBlock',
                    'editionsOverview',
                  ],
                });

                const onlyOnceBlockFilterSingle = excludeBlocksFilterSingle({
                  allBlockTypes: showBlocks,
                  onlyAllowedOnceBlockTypes: uniqueBlocks,
                })({
                  siblingData,
                });

                return onlyOnceBlockFilterSingle;
              },
              label: 'Content',
              name: 'content',
              type: 'blocks',
              validate: validateUniqueBlocksCumulativeAndSingle({
                cumulativeBlockTypes: OVERVIEW_BLOCK_TYPES,
                singleBlockTypes: uniqueBlocks,
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
    plural: 'Overview Pages',
    singular: 'Overview Page',
  },
  slug: 'overviewPage',
  versions,
};
