import { CollectionConfig } from 'payload';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { versions } from '@/field-templates/versions';

export const Theme: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
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
  versions,
};
