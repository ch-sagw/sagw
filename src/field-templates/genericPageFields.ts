import type {
  Field, FieldHook,
} from 'payload';
import slugify from 'slugify';
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

// hook to auto-generate slug from adminTitle when generateSlug
// checkbox is checked
const generateSlugHook: FieldHook = ({
  data, operation, originalDoc, value: isChecked,
}) => {
  if (operation === 'create') {
    if (data && !data.slug && data[fieldAdminTitleFieldName]) {
      slugify.extend({
        ä: 'ae',
        ö: 'oe',
        ü: 'ue',
      });
      data.slug = slugify(data[fieldAdminTitleFieldName], {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    return Boolean(!data?.slug);
  }

  if (operation === 'update') {
    if (!isChecked) {
      return false;
    }

    if (data && data[fieldAdminTitleFieldName]) {
      slugify.extend({
        ä: 'ae',
        ö: 'oe',
        ü: 'ue',
      });
      // Only generate if slug is empty or user hasn't manually changed it
      const userOverride = data.slug !== originalDoc?.slug;

      if (!userOverride || !data.slug) {
        data.slug = slugify(data[fieldAdminTitleFieldName], {
          lower: true,
          strict: true,
          trim: true,
        });
      }
    }

    return Boolean(!data?.slug);
  }

  return false;
};

export const genericPageFields = (isOverview?: boolean): Field[] => ([
  fieldLinkablePage,
  fieldAdminTitle,
  {
    admin: {
      position: 'sidebar',
    },
    fields: [
      {
        admin: {
          description: 'When enabled, the slug will auto-generate from the adminTitle field on save and autosave.',
          disableBulkEdit: true,
          disableGroupBy: true,
          disableListColumn: true,
          disableListFilter: true,
          hidden: true,
        },
        defaultValue: true,
        hooks: {
          beforeChange: [generateSlugHook],
        },
        localized: true,
        name: 'generateSlug',
        type: 'checkbox',
      },
      {
        access: fieldAccessNonLocalizableField,
        admin: {
          components: {
            Field: {
              clientProps: {
                useAsSlug: fieldAdminTitleFieldName,
              },
              path: '@payloadcms/ui#SlugField',
            },
          },
          width: '100%',
        },
        localized: true,
        name: 'slug',
        required: true,
        type: 'text',
        unique: false,
      },
    ],
    type: 'row',
  },
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
