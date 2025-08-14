import { GlobalConfig } from 'payload';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';

export const homeConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Pages',
  },
  fields: [
    fieldLinkablePage,
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
  slug: 'home',
};
