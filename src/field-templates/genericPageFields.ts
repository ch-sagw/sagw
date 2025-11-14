import { Field } from 'payload';
import { fieldParentSelectorDetailPage } from '@/field-templates/parentSelector';
import { fieldBreadcrumb } from '@/field-templates/breadcrumb';
import { fieldNavigationTitle } from '@/field-templates/navigationTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import { fieldSlug } from '@/field-templates/slug';
import { fieldAdminTitle } from '@/field-templates/adminTitle';

export const genericPageFields = (): Field[] => ([
  fieldLinkablePage,
  fieldAdminTitle,
  fieldSlug,
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
