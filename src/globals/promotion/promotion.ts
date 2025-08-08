import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { SubpageSection } from '@/blocks/SubpageSection';
import { fieldsContactForm } from '@/field-templates/forms';

export const promotionConfig: GlobalConfig = {
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
                {
                  localized: true,
                  name: 'lead',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Hero',
              name: 'hero',
              type: 'group',
            },

            // Subpage Sections
            {
              blocks: [SubpageSection],
              label: 'Subpage Sections',
              minRows: 1,
              name: 'subpageSections',
              required: true,
              type: 'blocks',
            },

            // Faq
            {
              fields: [
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
              fields: fieldsContactForm,
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
  slug: 'promotion',
};
