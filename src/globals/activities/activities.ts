import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsLinkInternal } from '@/field-templates/links';
import { SubpageSection } from '@/blocks/SubpageSection';

export const activitiesConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Activities Pages',
  },
  fields: [
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Hero',
              name: 'hero',
              type: 'group',
            },

            // Projects section
            {
              blocks: [SubpageSection],
              label: 'Subpage Sections',
              minRows: 1,
              name: 'subpageSections',
              required: true,
              type: 'blocks',
            },

            // Magazine section
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
                  name: 'lead',
                  required: true,
                  type: 'text',
                },
                {
                  fields: fieldsLinkInternal('pages'),
                  label: 'Link',
                  name: 'link',
                  type: 'group',
                },
              ],
              label: 'Magazine section',
              name: 'magazine',
              type: 'group',
            },

            // Publications section
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
                  name: 'lead',
                  required: true,
                  type: 'text',
                },
                {
                  fields: fieldsLinkInternal('pages'),
                  label: 'Link',
                  name: 'link',
                  type: 'group',
                },
              ],
              label: 'Publications section',
              name: 'publications',
              type: 'group',
            },

            // Events section
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  fields: fieldsLinkInternal('pages'),
                  label: 'Link',
                  name: 'link',
                  type: 'group',
                },
              ],
              label: 'Events section',
              name: 'events',
              type: 'group',
            },

            // News section
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  fields: fieldsLinkInternal('pages'),
                  label: 'Link',
                  name: 'link',
                  type: 'group',
                },
              ],
              label: 'News section',
              name: 'news',
              type: 'group',
            },

          ],
          label: 'Content',
        },

        // Meta Tabs
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  slug: 'activities',
};
