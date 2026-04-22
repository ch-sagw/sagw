import type {
  Field, FieldHook,
} from 'payload';
import slugify from 'slugify';
import {
  fieldParentSelectorDetailPage, fieldParentSelectorOverviewPage,
} from '@/field-templates/parentSelector';
import { fieldNavigationTitle } from '@/field-templates/navigationTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import { hookSlug } from '@/hooks-payload/slug';

const slugifyWithUmlauts = (value: string): string => {
  slugify.extend({
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
  });

  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
};

// hook to auto-generate slug from adminTitle when generateSlug
// checkbox is checked
const generateSlugHook: FieldHook = ({
  data, operation, originalDoc, value: isChecked,
}) => {
  if (operation === 'create') {
    if (data && !data.slug && data[fieldAdminTitleFieldName]) {
      data.slug = slugifyWithUmlauts(String(data[fieldAdminTitleFieldName]));
    }

    return Boolean(!data?.slug);
  }

  if (operation === 'update') {
    if (!isChecked) {
      return false;
    }

    if (data && data[fieldAdminTitleFieldName]) {
      // Only generate if slug is empty or user hasn't manually changed it
      const userOverride = data.slug !== originalDoc?.slug;

      if (!userOverride || !data.slug) {
        data.slug = slugifyWithUmlauts(String(data[fieldAdminTitleFieldName]));
      }
    }

    return Boolean(!data?.slug);
  }

  return false;
};

const duplicateSlugHook: FieldHook = ({
  value,
}) => {
  if (typeof value !== 'string' || !value) {
    return value;
  }

  return `${value}-copy-${Date.now()}`;
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
        custom: {
          slugify: ({
            valueToSlugify,
          }: { valueToSlugify?: unknown }): string => {
            if (!valueToSlugify) {
              return '';
            }

            return slugifyWithUmlauts(String(valueToSlugify));
          },
        },
        hooks: {
          beforeChange: [hookSlug],
          beforeDuplicate: [duplicateSlugHook],
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
