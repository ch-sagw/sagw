import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import {
  blocks, BlockSlug,
} from '@/blocks';
import { versions } from '@/field-templates/versions';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
import { genericPageHooks } from '@/hooks-payload/genericPageHooks';
import { genericPageFields } from '@/field-templates/genericPageFields';
import { pageAccess } from '@/access/pages';
import { allBlocksButTranslator } from '@/access/blocks';

const contentBlocks: BlockSlug[] = [
  'textBlock',
  'footnoteBlock',
  'linksBlock',
  'downloadsBlock',
  'imageBlock',
  'videoBlock',
  'accordionBlock',
  'formBlock',
  'ctaContactBlock',
  'ctaLinkBlock',
  'notificationBlock',
  'genericTeasersBlock',
];

const uniqueBlocks: BlockSlug[] = [
  'downloadsBlock',
  'linksBlock',
];

export const DetailPage: CollectionConfig = {
  access: pageAccess,
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
    plural: 'Detail Pages',
    singular: 'Detail Page',
  },
  slug: 'detailPage',
  versions,
};
