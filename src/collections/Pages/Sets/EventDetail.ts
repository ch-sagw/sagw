import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
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

const fieldsForDetailPage: Field[] = [

  {
    admin: {
      condition: (_, siblingsData) => siblingsData.showDetailPage === 'true',
    },
    fields: [
      // Hero
      fieldsHero,

      // Content Blocks
      {
        blockReferences: blocks(),
        blocks: [],
        label: 'Content',
        name: 'content',
        type: 'blocks',
      },
    ],
    type: 'group',
  },
];

const fieldsForNoDetailPage: Field[] = [
  {
    admin: {
      condition: (_, siblingsData) => siblingsData.showDetailPage === 'false',
    },
    fields: fieldsLinkExternal,
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
                  required: true,
                }),
                rte1({
                  name: 'location',
                  required: false,
                }),
                rte1({
                  name: 'language',
                  required: false,
                }),
                rte1({
                  name: 'time',
                  required: false,
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
                    condition: (data, siblingData) => siblingData.multipleDays,
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
