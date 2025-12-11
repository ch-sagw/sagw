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
import { pageAccess } from '@/access/pages';
import { sagwOnlyBlocks } from '@/access/blocks';
import { hookPreventBlockStructureChangesForTranslators } from '@/hooks-payload/preventBlockStructureChangesForTranslators';
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
import { hookPreventBulkPublishForTranslators } from '@/hooks-payload/preventBulkPublishForTranslators';
import { readFile } from 'fs/promises';
import { hookGenerateRteLinkPaths } from '@/hooks-payload/generateRteLinkPaths';
import { hookGenerateInternalLinkPaths } from '@/hooks-payload/generateInternalLinkPaths';

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

const uniqueBlocks: BlockSlug[] = [
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
    hideAPIURL: process.env.ENV === 'prod',
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
      defaultValue: async ({
        locale,
      }): Promise<string> => {
        let homeString = 'Home';

        if (locale) {
          const translationRawFile = (await readFile(new URL(`../../../i18n/messages/${locale}.json`, import.meta.url))).toString();
          const translationsFile = JSON.parse(translationRawFile);

          homeString = translationsFile.navigation.navigationTitle;
        }

        return homeString;

      },
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
                siblingData,
              }): Promise<BlockSlug[]> => {
                const onlyOnceBlockFilter = excludeBlocksFilterSingle({
                  allBlockTypes: JSON.parse(JSON.stringify(homeBlocks)),
                  onlyAllowedOnceBlockTypes: JSON.parse(JSON.stringify(uniqueBlocks)),
                })({
                  siblingData,
                });

                const showBlocks = await sagwOnlyBlocks({
                  allBlocks: onlyOnceBlockFilter,
                  req,
                  restrictedBlocks: ['homeTeasersBlock'],
                });

                return showBlocks;
              },
              label: 'Content',
              name: 'content',
              type: 'blocks',
              validate: validateUniqueBlocksSingle({
                onlyAllowedOnceBlockTypes: uniqueBlocks,
              }),
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
    beforeChange: [
      hookPreventBulkPublishForTranslators,
      hookGenerateBreadcrumbs,
    ],
    beforeValidate: [
      hookPreventBlockStructureChangesForTranslators(),
      hookGenerateRteLinkPaths,
      hookGenerateInternalLinkPaths,
    ],
  },
  labels: {
    plural: 'Home',
    singular: 'Home',
  },
  slug: 'homePage',
  versions,
};
