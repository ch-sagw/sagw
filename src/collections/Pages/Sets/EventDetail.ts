import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { blocks } from '@/blocks';
import { fieldsLinkExternal } from '@/field-templates/links';
import { versions } from '@/field-templates/versions';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
import { genericPageHooks } from '@/hooks-payload/genericPageHooks';
import { genericPageFields } from '@/field-templates/genericPageFields';

const contentBlocks = [
  'textBlock',
  'ctaLinkBlock',
  'downloadsBlock',
  'formBlock',
  'notificationBlock',
] as const;

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
                  name: 'category',
                  relationTo: 'eventCategory',
                  type: 'relationship',
                },
                {
                  name: 'project',
                  relationTo: 'projects',
                  required: false,
                  type: 'relationship',
                },
                {
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
                {
                  name: 'date',
                  required: true,
                  type: 'date',
                },
                {
                  defaultValue: false,
                  name: 'multipleDays',
                  type: 'checkbox',
                },
                {
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
  hooks: genericPageHooks(),
  labels: {
    plural: 'Event Detail Pages',
    singular: 'Event Detail Detail',
  },
  slug: 'eventDetailPage',
  versions,
};
