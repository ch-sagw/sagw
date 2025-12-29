import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import {
  blocks, BlockSlug,
} from '@/blocks';
import { fieldsLinkExternal } from '@/field-templates/links';
import { versions } from '@/field-templates/versions';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
import { genericPageHooks } from '@/hooks-payload/genericPageHooks';
import { hookUpdateLinkReferencesReverse } from '@/hooks-payload/updateLinkReferencesReverse';
import { genericPageFields } from '@/field-templates/genericPageFields';
import { pageAccess } from '@/access/pages';
import { allBlocksButTranslator } from '@/access/blocks';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

const contentBlocks: BlockSlug[] = [
  'textBlock',
  'ctaLinkBlock',
  'downloadsBlock',
  'formBlock',
  'notificationBlock',
];

type ContentBlock = typeof contentBlocks[number];

const uniqueBlocks: ContentBlock[] = ['downloadsBlock'];

const fieldsForDetailPage: Field[] = [
  {
    admin: {
      condition: (_, siblingsData) => siblingsData.showDetailPage === 'true',
    },
    fields: [
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
    label: '',
    name: 'blocks',
    type: 'group',
  },
];

const fieldsForNoDetailPage: Field[] = [
  {
    admin: {
      condition: (_, siblingsData) => siblingsData.showDetailPage === 'false',
    },
    fields: fieldsLinkExternal({
      hideLinkText: true,
    }),
    name: 'link',
    type: 'group',
  },
];

export const EventDetailPage: CollectionConfig = {
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
            {
              fields: [
                rte2({
                  name: 'title',
                }),
                rte1({
                  name: 'location',
                  notRequired: true,
                }),
                rte1({
                  name: 'language',
                  notRequired: true,
                }),
                {
                  admin: {
                    width: '50%',
                  },
                  fields: [
                    {
                      access: fieldAccessNonLocalizableField,
                      name: 'category',
                      relationTo: 'eventCategory',
                      type: 'relationship',
                    },
                    {
                      access: fieldAccessNonLocalizableField,
                      name: 'project',
                      relationTo: 'projects',
                      required: false,
                      type: 'relationship',
                    },
                  ],
                  type: 'row',
                },
                {
                  admin: {
                    width: '50%',
                  },
                  fields: [
                    {
                      access: fieldAccessNonLocalizableField,
                      name: 'date',
                      required: true,
                      type: 'date',
                    },
                    {
                      access: fieldAccessNonLocalizableField,
                      admin: {
                        date: {
                          displayFormat: 'HH:mm',
                          pickerAppearance: 'timeOnly',
                          timeFormat: 'HH:mm',
                          timeIntervals: 5,
                        },
                      },
                      name: 'time',
                      required: false,
                      type: 'date',
                    },
                  ],
                  type: 'row',
                },
                {
                  access: fieldAccessNonLocalizableField,
                  defaultValue: false,
                  name: 'multipleDays',
                  type: 'checkbox',
                },
                {
                  access: fieldAccessNonLocalizableField,
                  admin: {
                    condition: (_, siblingData) => siblingData.multipleDays,
                  },
                  name: 'dateEnd',
                  required: true,
                  type: 'date',
                },
              ],
              name: 'eventDetails',
              type: 'group',
            },
            {
              access: fieldAccessNonLocalizableField,
              defaultValue: 'false',
              label: 'Do you want to have a detail page for this event or should the event link to an external page?',
              name: 'showDetailPage',
              options: [
                {
                  label: 'Show Detail page',
                  value: 'true',
                },
                {
                  label: 'Link to an external page',
                  value: 'false',
                },

              ],
              type: 'radio',
            },
            ...fieldsForDetailPage,
            ...fieldsForNoDetailPage,
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
    afterChange: [hookUpdateLinkReferencesReverse],
  }),
  labels: {
    plural: 'Event Detail Pages',
    singular: 'Event Detail Detail',
  },
  slug: 'eventDetailPage',
  versions,
};
