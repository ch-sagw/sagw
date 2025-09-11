import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';
import {
  createAccess, globalAdminOrDepartmentAdminAccess,
} from '@/collections/Pages/access/globalAdminOrDepartmentAdmin';
import { blocks } from '@/blocks';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { versions } from '@/field-templates/versions';
import { fieldSlug } from '@/field-templates/slug';
import { hookSlug } from '@/hooks/slug';

export const DetailPage: CollectionConfig = {
  access: {
    create: createAccess,
    delete: globalAdminOrDepartmentAdminAccess,
    read: () => true,
    update: globalAdminOrDepartmentAdminAccess,
  },
  admin: {
    defaultColumns: [
      'adminTitle',
      'slug',
      'updatedAt',
      '_status',
    ],
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitle,
    fieldSlug,
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero([...fieldsColorMode]),

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
    beforeValidate: [
      hookAdminTitle,
      hookSlug,
    ],
  },
  labels: {
    plural: 'Detail Pages',
    singular: 'Detail Page',
  },
  slug: 'detailPage',
  versions,
};
