import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsTextBlock } from '@/field-templates/textBlock';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';

export const EarlyCareerAwardPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Promotion Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Early Career Award Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),

            // Text Blocks Before
            {
              fields: fieldsTextBlock,
              label: 'Text Blocks before Teasers',
              name: 'textBlocksBefore',
              required: true,
              type: 'array',
            },

            // Winners teasers
            {
              fields: [
                {
                  localized: true,
                  name: 'buttonText',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Winners Teasers',
              name: 'winnersTeasers',
              type: 'group',
            },

            // Text Blocks After
            {
              fields: fieldsTextBlock,
              label: 'Text Blocks after Teasers',
              name: 'textBlocksAfter',
              required: true,
              type: 'array',
            },

            // Downloads
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  hasMany: true,
                  localized: false,
                  name: 'downloads',
                  relationTo: 'documents',
                  required: true,
                  type: 'relationship',
                },
              ],
              label: 'Downloads',
              name: 'downloads',
              type: 'group',
            },

            // CTA
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
                  name: 'text',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'buttonText',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'CTA',
              name: 'cta',
              type: 'group',
            },

            // Faq
            {
              fields: [
                ...fieldsColorMode,
                {
                  hasMany: true,
                  name: 'faq',
                  relationTo: 'faqItems',
                  required: true,
                  type: 'relationship',
                },
              ],
              label: 'FAQ',
              name: 'faq',
              type: 'group',
            },

            // Contact
            {
              fields: [
                ...fieldsColorMode,
                {
                  filterOptions: () => ({
                    memberType: {
                      /* eslint-disable @typescript-eslint/naming-convention */
                      not_equals: 'executiveBoard',
                      /* eslint-enable @typescript-eslint/naming-convention */
                    },
                  }),
                  name: 'contactPerson',
                  relationTo: 'people',
                  required: true,
                  type: 'relationship',
                },
              ],
              label: 'Contact',
              name: 'contact',
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
  hooks: {
    beforeChange: [hookSeoFallback],
  },
  labels: {
    plural: 'Early Career Award',
    singular: 'Early Career Award',
  },
  slug: 'earlyCareerAward',
};
