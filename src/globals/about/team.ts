import { GlobalConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';

export const aboutTeamConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'About Pages',
  },
  fields: [
    fieldLinkablePage,
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
  slug: 'aboutTeam',
};
