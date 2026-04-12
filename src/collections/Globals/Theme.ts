import { CollectionConfig } from 'payload';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { globalContentAccessTheme } from '@/access/globalContent';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';

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
      defaultValue: 'amber',
      name: 'themeSelector',
      required: true,
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  labels: {
    plural: 'Theme',
    singular: 'Theme',
  },
  slug: 'theme',
};
