import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { globalAdminOrDepartmentAdminAccess } from '@/collections/InstituteDetail/access/globalAdminOrDepartmentAdmin';

export const InstituteDetailConfig: CollectionConfig = {
  access: {
    create: globalAdminOrDepartmentAdminAccess,
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
            fieldsHero([...fieldsColorMode]),

            // Institute Details
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
                  name: 'logo',
                  relationTo: 'images',
                  required: true,
                  type: 'relationship',
                },
                ...fieldsLinkInternalOrExternal,
              ],
              label: 'Institute Details',
              name: 'instituteDetails',
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
    beforeValidate: [hookAdminTitle],
  },
  labels: {
    plural: 'Institute Detail Pages',
    singular: 'Institute Detail',
  },
  slug: 'instituteDetail',
};
