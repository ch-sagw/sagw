import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHeroHome } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import {
  blocks, BlockSlug,
} from '@/blocks';
import { versions } from '@/field-templates/versions';
import { hookCascadeBreadcrumbUpdates } from '@/hooks-payload/cascadeBreadcrumbUpdates';
import { hookGenerateBreadcrumbs } from '@/hooks-payload/generateBreadcrumbs';
import { fieldNavigationTitleFieldName } from '@/field-templates/navigationTitle';
import { i18nNavigation } from '@/i18n/content';
import { pageAccess } from '@/access/pages';
import { sagwOnlyBlocks } from '@/access/blocks';
import { hookPreventBlockStructureChangesForTranslators } from '@/hooks-payload/preventBlockStructureChangesForTranslators';

const homeBlocks: BlockSlug[] = [
  'textBlock',
  'formBlock',
  'homeTeasersBlock',
  'projectsTeasersBlock',
  'eventsTeasersBlock',
  'magazineTeasersBlock',
  'newsTeasersBlock',
  'publicationsTeasersBlock',
];

export const HomePage: CollectionConfig = {
  access: pageAccess,
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
              blocks: blocks(homeBlocks),
              filterOptions: async ({
                req,
              }): Promise<BlockSlug[]> => {
                const showBlocks = await sagwOnlyBlocks({
                  allBlocks: homeBlocks,
                  req,
                  restrictedBlocks: ['homeTeasersBlock'],
                });

                return showBlocks;
              },
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
    beforeValidate: [hookPreventBlockStructureChangesForTranslators()],
  },
  labels: {
    plural: 'Home',
    singular: 'Home',
  },
  slug: 'homePage',
  versions,
};
