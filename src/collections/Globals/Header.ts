import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { rte1 } from '@/field-templates/rte';
import { fieldInternalLinkChooser } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';
import { globalContentAccessNoTranslatorNoEditor } from '@/access/globalContent';
import { hookInvalidateCacheOnPageChange } from '@/hooks-payload/invalidateCacheOnPageChange';

const navLinkDefaultFields: Field[] = [
  {
    admin: {
      width: '50%',
    },
    fields: [
      rte1({
        name: 'navItemText',
      }),
      fieldInternalLinkChooser({
        name: 'navItemLink',
        optional: false,
      }),
    ],
    type: 'row',
  },
];

const linkField = fieldInternalLinkChooser({
  name: 'navItemLink',
  optional: false,
});

const navLinkLevel1LinkField = ((): Field => ({
  ...linkField,
  admin: {
    ...linkField.admin,
    condition: (_, siblingData) => {
      // Show the field only if there are no sub-nav items
      const hasSubNavItems = Array.isArray(siblingData?.subNavItems) && siblingData.subNavItems.length > 0;

      return !hasSubNavItems;
    },
  },
} as Field))();

const navLinkLevel1: Field[] = [
  {
    fields: [
      {
        ...rte1({
          adminDescription: 'If the user hovers over this menu item in the navigation, this is shown as a description in the Header',
          name: 'description',
          notRequired: true,
        }),
      },
      rte1({
        name: 'navItemText',
      }),
      navLinkLevel1LinkField,
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
  access: globalContentAccessNoTranslatorNoEditor,
  admin: {
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
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
  hooks: {
    afterChange: [hookInvalidateCacheOnPageChange],
  },
  labels: {
    plural: 'Header',
    singular: 'Header',
  },
  slug: 'header',
};
