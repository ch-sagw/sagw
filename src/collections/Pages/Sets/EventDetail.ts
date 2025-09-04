import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';
import { blocks } from '@/blocks';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkExternal } from '@/field-templates/links';
import { versions } from '@/field-templates/versions';
import { fieldSlug } from '@/field-templates/slug';
import { hookSlug } from '@/hooks/slug';

const fieldsForDetailPage: Field[] = [

  {
    admin: {
      condition: (_, siblingsData) => siblingsData.showDetailPage === 'true',
    },
    fields: [
      // Hero
      fieldsHero([...fieldsColorMode]),

      // Content Blocks
      {
        blocks: blocks(),
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
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'location',
                  required: false,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'language',
                  required: false,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'time',
                  required: false,
                  type: 'text',
                },
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
