import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';
import { rte2 } from '@/field-templates/rte';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
import { genericPageHooks } from '@/hooks-payload/genericPageHooks';
import { genericPageFields } from '@/field-templates/genericPageFields';
import { pageAccessInstituteDetail } from '@/access/pages';

const contentBlocks = [
  'textBlock',
  'linksBlock',
  'notificationBlock',
] as const;

type ContentBlock = typeof contentBlocks[number];

const uniqueBlocks: ContentBlock[] = ['linksBlock'];

export const InstituteDetailPage: CollectionConfig = {
  access: pageAccessInstituteDetail,
  admin: {
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
                    description: 'This image will be used for the teasers on the overview page.',
                  },
                  name: 'image',
                  relationTo: 'images',
                  required: true,
                  type: 'relationship',
                },
                {
                  admin: {
                    description: 'This text will be used for the teasers on the overview page.',
                  },
                  ...rte2({
                    name: 'teaserText',
                  }),
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Hero
            fieldsHero,

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
    plural: 'Institute Detail Pages',
    singular: 'Institute Detail Page',
  },
  slug: 'instituteDetailPage',
  versions,
};
