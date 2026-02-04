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
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import { preview } from '@/utilities/previewUrl';

const contentBlocks: BlockSlug[] = [
  'textBlock',
  'linksBlock',
  'downloadsBlock',
  'formBlock',
  'bibliographicReferenceBlock',
  'notificationBlock',
  'publicationsTeasersBlock',
];

const uniqueBlocks: BlockSlug[] = [
  'downloadsBlock',
  'linksBlock',
  'publicationsTeasersBlock',
];

export const PublicationDetailPage: CollectionConfig = {
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
    preview,
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
                    width: '50%',
                  },
                  fields: [
                    {
                      access: fieldAccessNonLocalizableField,
                      admin: {
                        description: 'This image will be used for the teasers on the overview page.',
                      },
                      name: 'image',
                      relationTo: 'images',
                      required: true,
                      type: 'relationship',
                    },
                    {
                      access: fieldAccessNonLocalizableField,
                      admin: {
                        description: 'The same date shown in the asset (Documents or Zenodo Documents) should be added.',
                      },
                      name: 'date',
                      required: true,
                      type: 'date',
                    },
                  ],
                  type: 'row',
                },
              ],
              label: 'Overview Page and Teaser Block Properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Categorization
            {
              fields: [
                {
                  fields: [
                    {
                      access: fieldAccessNonLocalizableField,
                      admin: {
                        description: 'Add topic, if the filter on the publication overview page should include this publication.',
                        width: '33.33%',
                      },
                      name: 'topic',
                      relationTo: 'publicationTopics',
                      required: false,
                      type: 'relationship',
                    },
                    {
                      access: fieldAccessNonLocalizableField,
                      admin: {
                        description: 'Add type, if the filter on the publication overview page should include this publication.',
                        width: '33.33%',
                      },
                      name: 'type',
                      relationTo: 'publicationTypes',
                      required: false,
                      type: 'relationship',
                    },
                    {
                      access: fieldAccessNonLocalizableField,
                      admin: {
                        description: 'If the news belongs to a project, add the project.',
                        width: '33.33%',
                      },
                      name: 'project',
                      relationTo: 'projects',
                      required: false,
                      type: 'relationship',
                    },
                  ],
                  type: 'row',
                },
              ],
              label: 'Categorization',
              name: 'categorization',
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
  hooks: genericPageHooks({
    afterChange: [],
  }),
  labels: {
    plural: 'Publication Detail Pages',
    singular: 'Publication Detail',
  },
  slug: 'publicationDetailPage',
  versions,
};
