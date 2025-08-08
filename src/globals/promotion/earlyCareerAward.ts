import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/TextBlock';
import { fieldsColorMode } from '@/field-templates/colorMode';

export const earlyCareerAwardConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Promotion Pages',
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

            // Text Blocks Before
            {
              blocks: [TextBlock],
              label: 'Text Blocks before Teasers',
              minRows: 1,
              name: 'textBlocksBefore',
              required: true,
              type: 'blocks',
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
              blocks: [TextBlock],
              label: 'Text Blocks after Teasers',
              minRows: 1,
              name: 'textBlocksAfter',
              required: true,
              type: 'blocks',
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
  slug: 'earlyCareerAward',
};
