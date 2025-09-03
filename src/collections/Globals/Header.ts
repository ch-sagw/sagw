import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { versions } from '@/field-templates/versions';

const navLink: Field[] = [
  {
    fields: [
      {
        localized: true,
        name: 'navItemText',
        required: true,
        type: 'text',
      },
      {
        admin: {
          components: {
            Field: {
              path: '@/components/admin/InternalLinkChooser/InternalLinkChooser',
            },
          },
        },
        name: 'navItemLink',
        type: 'text',
      },
    ],
    type: 'group',
  },
];

export const Header: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldAdminTitleDefaultValue('Header'),
    {
      tabs: [
        {
          fields: [
            {
              fields: [
                ...navLink,
                {
                  fields: navLink,
                  label: 'Sub-Navigation Item',
                  maxRows: 5,
                  name: 'subNavItems',
                  type: 'array',
                },
              ],
              label: 'Main-Navigation Item',
              maxRows: 4,
              name: 'navItems',
              required: true,
              type: 'array',
            },
          ],
          label: 'Navigation',
        },
        {
          fields: [
            {
              fields: fieldsLinkInternalOrExternal,
              maxRows: 3,
              name: 'metaLinks',
              type: 'array',
            },
          ],
          label: 'Metanvaigation',
        },
        {
          fields: [
            {
              label: 'Logo (SVG)',
              name: 'logo',
              relationTo: 'svgs',
              required: true,
              type: 'relationship',
            },
          ],
          label: 'Logo',
        },
      ],
      type: 'tabs',
    },
  ],
  labels: {
    plural: 'Header',
    singular: 'Header',
  },
  slug: 'header',
  versions,
};
