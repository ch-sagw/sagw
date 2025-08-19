import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsSubpageSection } from '@/field-templates/subpageSection';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const ActivitiesPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Activities Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Activities Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),

            // Projects section
            {
              fields: fieldsSubpageSection,
              label: 'Subpage Sections',
              name: 'subpageSections',
              required: true,
              type: 'array',
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
                  localized: true,
                  name: 'linkText',
                  required: true,
                  type: 'text',
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
                  localized: true,
                  name: 'linkText',
                  required: true,
                  type: 'text',
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
                  localized: true,
                  name: 'linkText',
                  required: true,
                  type: 'text',
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
                  localized: true,
                  name: 'linkText',
                  required: true,
                  type: 'text',
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
  labels: {
    plural: 'Activities',
    singular: 'Activities',
  },
  slug: 'activities',
};
