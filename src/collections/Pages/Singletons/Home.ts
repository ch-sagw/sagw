import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHeroHome } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';
import { hookCascadeBreadcrumbUpdates } from '@/hooks-payload/cascadeBreadcrumbUpdates';
import { hookGenerateBreadcrumbs } from '@/hooks-payload/generateBreadcrumbs';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { i18nNavigation } from '@/i18n/content';

export const HomePage: CollectionConfig = {
  access: {
    create: (): boolean => true,
    delete: (): boolean => true,
    read: (): boolean => true,
    update: (): boolean => true,
  },
  admin: {
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Home Page'),
    {
      admin: {
        hidden: true,
        readOnly: true,
      },
      defaultValue: ({
        locale,
      }) => (locale
        ? i18nNavigation.navigationTitleTranslations[locale]
        : 'Home'),
      localized: true,
      name: fieldNavigationTitleFieldName,
      required: false,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
        readOnly: true,
      },
      defaultValue: 'home',
      localized: true,
      name: 'slug',
      type: 'text',
    },
    {
      tabs: [

        // Content Tab
        {
          fields: [
            fieldsHeroHome,

            // Content Blocks
            {
              blocks: blocks([
                'textBlock',
                'formBlock',
                'homeTeasersBlock',
                'projectsTeasersBlock',
                'eventsTeasersBlock',
                'magazineTeasersBlock',
                'newsTeasersBlock',
                'publicationsTeasersBlock',
              ]),
              label: 'Content',
              name: 'content',
              type: 'blocks',
            },
          ],
          label: 'Content',
        },

        // Meta Tab
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  hooks: {
    afterChange: [hookCascadeBreadcrumbUpdates],

    beforeChange: [hookGenerateBreadcrumbs],
  },
  labels: {
    plural: 'Home',
    singular: 'Home',
  },
  slug: 'homePage',
  versions,
};
