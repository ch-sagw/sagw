import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { superAdminOrTenantAdminAccess } from '@/collections/Pages/access/superAdminOrTenantAdmin';
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
  'formBlock',
  'ctaContactBlock',
  'notificationBlock',
  'eventsTeasersBlock',
  'newsTeasersBlock',
  'publicationsTeasersBlock',
] as const;

type ContentBlock = typeof contentBlocks[number];

const uniqueBlocks: ContentBlock[] = [
  'downloadsBlock',
  'linksBlock',
];

export const ProjectDetailPage: CollectionConfig = {
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: () => true,
    update: superAdminOrTenantAdminAccess,
  },
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

            // project relation
            {
              name: 'project',
              relationTo: 'projects',
              required: true,
              type: 'relationship',
            },

            // Overview Page properties
            {
              fields: [
                {
                  ...rte1({
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
    plural: 'Project Detail Pages',
    singular: 'Project Detail Page',
  },
  slug: 'projectDetailPage',
  versions,
};
