import {
  CollectionAfterReadHook, CollectionConfig,
} from 'payload';
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
import { hookUpdateLinkReferences } from '@/hooks-payload/updateLinkReferences';
import { Config } from '@/payload-types';
import { getTranslations } from 'next-intl/server';

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

export const homeSlug = 'home';

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
      defaultValue: homeSlug,
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
    afterChange: [
      hookCascadeBreadcrumbUpdates,
      hookUpdateLinkReferences,
    ],
    afterRead: [
      async ({
        doc,
        req,
      }): Promise<CollectionAfterReadHook<any>> => {
        if (!doc) {
          return doc;
        }

        const locale = (req?.locale as Config['locale']) || 'de';
        const t = await getTranslations({
          locale,
          namespace: 'navigation',
        });
        const homeNavigationTitle = t('navigationTitle');
        const fallback = 'Home';

        return {
          ...doc,
          navigationTitle: homeNavigationTitle || fallback,
        };
      },
    ],
    beforeChange: [
      hookPreventBulkPublishForTranslators,
      hookGenerateBreadcrumbs,
    ],
    beforeValidate: [hookPreventBlockStructureChangesForTranslators()],
  },
  labels: {
    plural: 'Home',
    singular: 'Home',
  },
  slug: 'homePage',
  versions,
};
