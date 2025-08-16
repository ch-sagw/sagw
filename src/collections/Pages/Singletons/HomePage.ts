import { CollectionConfig } from 'payload';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const HomePage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Home Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [
            fieldsHero([
              {
                localized: true,
                name: 'sideTitle',
                required: true,
                type: 'text',
              },
              fieldsLinkInternalWithToggle,
            ]),
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
    plural: 'Home',
    singular: 'Home',
  },
  slug: 'home',
};
