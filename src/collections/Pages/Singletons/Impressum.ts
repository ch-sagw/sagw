import {
  CollectionAfterReadHook, CollectionConfig,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import {
  blocks, BlockSlug,
} from '@/blocks';
import { versions } from '@/field-templates/versions';
import { pageAccess } from '@/access/pages';
import { hookPreventBlockStructureChangesForTranslators } from '@/hooks-payload/preventBlockStructureChangesForTranslators';
import { allBlocksButTranslator } from '@/access/blocks';
import { hookPreventBulkPublishForTranslators } from '@/hooks-payload/preventBulkPublishForTranslators';

const contentBlocks: BlockSlug[] = ['textBlock'];

export const ImpressumPage: CollectionConfig = {
  access: pageAccess,
  admin: {
    group: 'Pages',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    {
      admin: {
        hidden: true,
        readOnly: true,
      },
      localized: true,
      name: 'slug',
      required: false,
      type: 'text',
    },
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Impressum'),
    {
      tabs: [

        // Content Tab
        {
          fields: [
            fieldsHero,

            // Content Blocks
            {
              blocks: blocks(contentBlocks),
              filterOptions: ({
                req,
              }): BlockSlug[] => allBlocksButTranslator({
                allBlocks: contentBlocks,
                req,
              }),
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
        const fallback = 'impressum';
        let impressumSlug;

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

          impressumSlug = {
            de: translationRawFileDe.slugs.impressum,
            en: translationRawFileEn.slugs.impressum,
            fr: translationRawFileFr.slugs.impressum,
            it: translationRawFileIt.slugs.impressum,
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

          impressumSlug = translationsFile.slugs.impressum;
        }

        return {
          ...doc,
          slug: impressumSlug || fallback,
        };
      },
    ],
    beforeChange: [hookPreventBulkPublishForTranslators],
    beforeValidate: [hookPreventBlockStructureChangesForTranslators()],
  },
  labels: {
    plural: 'Impressum',
    singular: 'Impressum',
  },
  slug: 'impressumPage',
  versions,
};
