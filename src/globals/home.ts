import { GlobalConfig } from 'payload';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { fieldsTabMeta } from '@/field-templates/meta';

export const homeConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Pages',
  },
  fields: [
    {
      tabs: [

        // Content Tab
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
              localized: true,
              name: 'sideTitle',
              required: true,
              type: 'text',
            },
            {
              localized: true,
              name: 'lead',
              required: false,
              type: 'text',
            },
            fieldsLinkInternalWithToggle('pages'),
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
