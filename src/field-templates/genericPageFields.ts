import {
  Field, slugField,
  TextField,
} from 'payload';
import {
  fieldParentSelectorDetailPage, fieldParentSelectorOverviewPage,
} from '@/field-templates/parentSelector';
import { fieldBreadcrumb } from '@/field-templates/breadcrumb';
import { fieldNavigationTitle } from '@/field-templates/navigationTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

export const genericPageFields = (isOverview?: boolean): Field[] => ([
  fieldLinkablePage,
  fieldAdminTitle,
  slugField({
    fieldToUse: fieldAdminTitleFieldName,
    localized: true,
    overrides: (defaultField) => ({
      ...defaultField,
      fields: defaultField.fields.map((field) => {
        if ('name' in field && field.name === 'slug') {
          // Create a new field object without unique property
          const {
            ...fieldWithoutUnique
          } = field as TextField & { unique?: boolean };

          return {
            ...fieldWithoutUnique,
            access: fieldAccessNonLocalizableField,
            // unique is removed - slugs are unique per tenant,
            // enforced by hookSlug hook
          } as TextField;
        }

        return field;
      }),
    })
    ,
  }),
  fieldNavigationTitle,
  isOverview
    ? fieldParentSelectorOverviewPage
    : fieldParentSelectorDetailPage,
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
