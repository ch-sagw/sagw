import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { SubpageSection } from '@/blocks/SubpageSection';
import { fieldsContactForm } from '@/field-templates/forms';
import { fieldsHero } from '@/field-templates/hero';

export const promotionConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Promotion Pages',
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: true,
      name: 'isLinkable',
      type: 'checkbox',
    },
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),

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
