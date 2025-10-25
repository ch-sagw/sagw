import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';

const navLinkDefaultFields: Field[] = [
  rte1({
    name: 'navItemText',
  }),
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
];

const navLinkLevel1: Field[] = [
  {
    fields: [
      {
        admin: {
          description: 'If the user hovers over this menu item in the navigation, this is shown as a description in the Header',
        },
        ...rte1({
          name: 'description',
          notRequired: true,
        }),
      },
      ...navLinkDefaultFields,
    ],
    type: 'group',
  },
];

const navLinkLevel2: Field[] = [
  {
    fields: navLinkDefaultFields,
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
                ...navLinkLevel1,
                {
                  fields: navLinkLevel2,
                  label: 'Sub-Navigation Item',
                  maxRows: 6,
                  name: 'subNavItems',
                  type: 'array',
                },
              ],
              label: 'Main-Navigation Item',
              maxRows: 5,
              name: 'navItems',
              required: true,
              type: 'array',
            },
          ],
          interfaceName: 'InterfaceHeaderNavigation',
          label: 'Navigation',
          name: 'navigation',
        },
        {
          fields: [
            {
              fields: fieldsLinkInternalOrExternal({}),
              maxRows: 3,
              name: 'metaLinks',
              type: 'array',
            },
          ],
          interfaceName: 'InterfaceHeaderMetaNavigation',
          label: 'Metanvaigation',
          name: 'metanavigation',
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
