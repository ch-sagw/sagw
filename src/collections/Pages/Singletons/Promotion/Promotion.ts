import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsSubpageSection } from '@/field-templates/subpageSection';
import { fieldsContactForm } from '@/field-templates/forms';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const PromotionPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Promotion Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Promotion Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),

            // Subpage Sections
            {
              fields: fieldsSubpageSection,
              label: 'Subpage Sections',
              minRows: 1,
              name: 'subpageSections',
              required: true,
              type: 'array',
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
  labels: {
    plural: 'Promotion',
    singular: 'Promotion',
  },
  slug: 'promotion',
};
