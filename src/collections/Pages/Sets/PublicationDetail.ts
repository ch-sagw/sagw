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
                  name: 'date',
                  required: true,
                  type: 'date',
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
                  fields: [
                    {
                      access: fieldAccessNonLocalizableField,
                      admin: {
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
  hooks: genericPageHooks(),
  labels: {
    plural: 'Publication Detail Pages',
    singular: 'Publication Detail',
  },
  slug: 'publicationDetailPage',
  versions,
};
