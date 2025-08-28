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

export const DetailPage: CollectionConfig = {
  access: {
    create: createAccess,
    delete: globalAdminOrDepartmentAdminAccess,
    read: () => true,
    update: globalAdminOrDepartmentAdminAccess,
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

            // Hero
            fieldsHero(),

            // Content Blocks
            {
              blocks: blocks(),
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
    plural: 'Detail Pages',
    singular: 'Detail Page',
  },
  slug: 'detailPage',
};
