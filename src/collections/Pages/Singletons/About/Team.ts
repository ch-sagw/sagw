import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

export const AboutTeamPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'About Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Team Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),
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
    plural: 'Team',
    singular: 'Team',
  },
  slug: 'aboutTeam',
};
