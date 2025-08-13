import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { ContactAccordionItemBlock } from '@/blocks/ContactAccordionItem';
import { fieldsHero } from '@/field-templates/hero';

export const aboutContactConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'About Pages',
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

            // Addresses
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  blocks: [ContactAccordionItemBlock],
                  minRows: 1,
                  name: 'contacts',
                  type: 'blocks',
                },
              ],
              label: 'Addresses',
              name: 'addresses',
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
  slug: 'aboutContact',
};
