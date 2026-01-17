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
import { homeSlug } from '@/collections/constants';
import { hookInvalidateCacheOnPageChange } from '@/hooks-payload/invalidateCacheOnPageChange';

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
      hookInvalidateCacheOnPageChange,
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

        const translationPathDe = new URL('../../../i18n/messages/de.json', import.meta.url).href;
        const translationPathEn = new URL('../../../i18n/messages/en.json', import.meta.url).href;
        const translationPathFr = new URL('../../../i18n/messages/fr.json', import.meta.url).href;
        const translationPathIt = new URL('../../../i18n/messages/it.json', import.meta.url).href;

        if (locale && locale === 'all') {
          const translationRawFileDe = (await import(translationPathDe, {
            with: {
              type: 'json',
            },
          })).default;
          const translationRawFileEn = (await import(translationPathEn, {
            with: {
              type: 'json',
            },
          })).default;
          const translationRawFileFr = (await import(translationPathFr, {
            with: {
              type: 'json',
            },
          })).default;
          const translationRawFileIt = (await import(translationPathIt, {
            with: {
              type: 'json',
            },
          })).default;

          homeNavigationTitle = {
            de: translationRawFileDe.navigation.navigationTitle,
            en: translationRawFileEn.navigation.navigationTitle,
            fr: translationRawFileFr.navigation.navigationTitle,
            it: translationRawFileIt.navigation.navigationTitle,
          };

        } else if (locale) {
          let translationsFile;

          switch (locale) {
            case 'de':
              translationsFile = (await import(translationPathDe, {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            case 'en':
              translationsFile = (await import(translationPathEn, {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            case 'fr':
              translationsFile = (await import(translationPathFr, {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            case 'it':
              translationsFile = (await import(translationPathIt, {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            default:
              translationsFile = (await import(translationPathDe, {
                with: {
                  type: 'json',
                },
              })).default;
          }

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
