import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import {
  blocks, BlockSlug,
} from '@/blocks';
import { versions } from '@/field-templates/versions';
import {
  rte1, rte2,
} from '@/field-templates/rte';
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
  'formBlock',
  'ctaContactBlock',
  'notificationBlock',
  'eventsTeasersBlock',
  'newsTeasersBlock',
  'publicationsTeasersBlock',
];

const uniqueBlocks: BlockSlug[] = [
  'downloadsBlock',
  'linksBlock',
  'eventsTeasersBlock',
  'newsTeasersBlock',
  'publicationsTeasersBlock',
];

export const ProjectDetailPage: CollectionConfig = {
  access: pageAccess,
  admin: {
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

            // project relation
            {
              access: fieldAccessNonLocalizableField,
              name: 'project',
              relationTo: 'projects',
              required: true,
              type: 'relationship',
            },

            // Overview Page properties
            {
              fields: [
                {
                  ...rte2({
                    adminDescription: 'This text will be used as text for the teasers on the overview page and in teaser blocks.',
                    name: 'teaserText',
                  }),
                },
                {
                  ...rte1({
                    adminDescription: 'This text will be used as link-text for the teasers on the overview page and in teaser blocks.',
                    name: 'linkText',
                  }),
                },
              ],
              label: 'Overview Page & Teaser Block properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Hero
            fieldsHero,

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
  hooks: genericPageHooks(),
  labels: {
    plural: 'Project Detail Pages',
    singular: 'Project Detail Page',
  },
  slug: 'projectDetailPage',
  versions,
};
