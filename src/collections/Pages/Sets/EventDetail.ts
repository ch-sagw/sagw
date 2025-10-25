import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks-payload/seoFallback';
import { blocks } from '@/blocks';
import { fieldsLinkExternal } from '@/field-templates/links';
import { versions } from '@/field-templates/versions';
import { fieldSlug } from '@/field-templates/slug';
import { hookSlug } from '@/hooks-payload/slug';
import { rte1 } from '@/field-templates/rte';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';

const contentBlocks = [
  'textBlock',
  'ctaLinkBlock',
  'downloadsBlock',
  'formBlock',
  'notificationBlock',
] as const;

const fieldsForDetailPage: Field[] = [
  {
    blocks: blocks(contentBlocks),
    filterOptions: excludeBlocksFilterSingle({
      allBlockTypes: contentBlocks,
      onlyAllowedOnceBlockTypes: ['downloadsBlock'],
    }),
    label: 'Content',
    name: 'content',
    type: 'blocks',
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
    fieldLinkablePage,
    fieldAdminTitle,
    fieldSlug,
    {
      tabs: [

        // Content Tab
        {
          fields: [
            {
              fields: [
                rte1({
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
                      timeIntervals: 10,
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
  hooks: {
    beforeChange: [hookSeoFallback],
    beforeValidate: [
      hookAdminTitle,
      hookSlug,
    ],
  },
  labels: {
    plural: 'Event Detail Pages',
    singular: 'Event Detail Detail',
  },
  slug: 'eventDetailPage',
  versions,
};
