import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks-payload/seoFallback';
import { superAdminOrTenantAdminAccess } from '@/collections/Pages/access/superAdminOrTenantAdmin';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';

export const NationalDictionaryDetailPage: CollectionConfig = {
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: () => true,
    update: superAdminOrTenantAdminAccess,
  },
  admin: {
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitle,
    {
      tabs: [

        // Content Tab
        {
          fields: [
            // Overview Page properties
            {
              fields: [
                {
                  admin: {
                    description: 'This image will be used for the teasers on the overview page.',
                  },
                  name: 'image',
                  relationTo: 'images',
                  required: false,
                  type: 'relationship',
                },
                {
                  admin: {
                    description: 'This text will be used for the teasers on the overview page.',
                  },
                  localized: true,
                  name: 'text',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Hero
            fieldsHero(false),

            // Content Blocks
            {
              blockReferences: blocks(),
              blocks: [],
              label: 'Content',
              name: 'content',
              type: 'blocks',
            },
          ],
          label: 'Content',
        },

        // Meta Tab
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  hooks: {
    beforeChange: [hookSeoFallback],
    beforeValidate: [hookAdminTitle],
  },
  labels: {
    plural: 'National Dictionary Detail Pages',
    singular: 'National Dictionary Detail Page',
  },
  slug: 'nationalDictionaryDetailPage',
  versions,
};
