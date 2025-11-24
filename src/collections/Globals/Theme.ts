import { CollectionConfig } from 'payload';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { globalContentAccessTheme } from '@/access/globalContent';

export const Theme: CollectionConfig = {
  access: globalContentAccessTheme,
  admin: {
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldAdminTitleDefaultValue('Theme'),
    {
      admin: {
        components: {
          Field: {
            path: '@/components/admin/ThemeSelector/ThemeSelector',
          },
        },
      },
      defaultValue: 'ocean',
      name: 'themeSelector',
      required: true,
      type: 'text',
    },
  ],
  labels: {
    plural: 'Theme',
    singular: 'Theme',
  },
  slug: 'theme',
};
