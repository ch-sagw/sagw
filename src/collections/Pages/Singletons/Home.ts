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
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { homeSlug } from '@/collections/constants';
import {
  dirname, join,
} from 'path';

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
      defaultValue: 'Home',
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

        // we can not use getTranslations... It works in Admin-Ui since
        // rendered on the server. But in playwright, context strangely switches
        // to client, which makes getTranslations throw an error.

        const locale = req?.locale || 'de';
        const fallback = 'Home';
        let homeNavigationTitle;

        /* eslint-disable @typescript-eslint/naming-convention */
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        /* eslint-enable @typescript-eslint/naming-convention */
        const messagesDir = join(__dirname, '../../../i18n/messages');

        if (locale && locale === 'all') {
          const translationRawFileDe = (await readFile(join(messagesDir, 'de.json'))).toString();
          const translationRawFileEn = (await readFile(join(messagesDir, 'en.json'))).toString();
          const translationRawFileFr = (await readFile(join(messagesDir, 'fr.json'))).toString();
          const translationRawFileIt = (await readFile(join(messagesDir, 'it.json'))).toString();

          homeNavigationTitle = {
            de: JSON.parse(translationRawFileDe).navigation.navigationTitle,
            en: JSON.parse(translationRawFileEn).navigation.navigationTitle,
            fr: JSON.parse(translationRawFileFr).navigation.navigationTitle,
            it: JSON.parse(translationRawFileIt).navigation.navigationTitle,
          };

        } else if (locale) {
          const translationRawFile = (await readFile(join(messagesDir, `${locale}.json`))).toString();
          const translationsFile = JSON.parse(translationRawFile);

          homeNavigationTitle = translationsFile.navigation.navigationTitle;
        }

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
