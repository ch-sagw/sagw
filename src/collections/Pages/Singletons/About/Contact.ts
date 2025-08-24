import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsContactAccordionItem } from '@/field-templates/contactAccordionItem';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';

export const AboutContactPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'About Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Contact Page'),
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
                  fields: fieldsContactAccordionItem,
                  name: 'contacts',
                  required: true,
                  type: 'array',
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
  hooks: {
    beforeChange: [hookSeoFallback],
  },
  labels: {
    plural: 'Contact',
    singular: 'Contact',
  },
  slug: 'aboutContact',
};
