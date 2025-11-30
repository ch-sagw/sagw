import {
  Field, slugField,
  TextField,
} from 'payload';
import { fieldParentSelectorDetailPage } from '@/field-templates/parentSelector';
import { fieldBreadcrumb } from '@/field-templates/breadcrumb';
import { fieldNavigationTitle } from '@/field-templates/navigationTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

export const genericPageFields = (): Field[] => ([
  fieldLinkablePage,
  fieldAdminTitle,
  slugField({
    fieldToUse: fieldAdminTitleFieldName,
    localized: true,
    overrides: (defaultField) => {
      defaultField.fields.forEach((field) => {
        if ('name' in field && field.name === 'slug') {
          const customSlugField = field as TextField;

          customSlugField.unique = false;
          customSlugField.index = false;
          customSlugField.access = fieldAccessNonLocalizableField;

          /* eslint-disable no-param-reassign */
          field = customSlugField;
          /* eslint-enable no-param-reassign */
        }
      });

      return defaultField;
    },
  }),
  fieldNavigationTitle,
  fieldParentSelectorDetailPage,
  fieldBreadcrumb,
  {
    admin: {
      components: {
        Field: {
          path: '@/components/admin/BreadcrumbField/BreadcrumbField',
        },
      },
      position: 'sidebar',
    },
    name: 'breadcrumbUI',
    type: 'ui',
  },
]);
