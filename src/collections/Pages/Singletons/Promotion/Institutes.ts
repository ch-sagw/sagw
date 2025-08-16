import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const InstitutesPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Promotion Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Institutes Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero([...fieldsColorMode]),

            // Teasers
            {
              fields: [
                {
                  localized: true,
                  name: 'teaserLinkText',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Teasers',
              name: 'teasers',
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
    plural: 'Institutes',
    singular: 'Institutes',
  },
  slug: 'institutes',
};
