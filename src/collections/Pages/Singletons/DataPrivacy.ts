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

export const DataPrivacyPage: CollectionConfig = {
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
    fieldAdminTitleDefaultValue('Data Privacy'),
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
        const fallback = 'dataPrivacy';
        let dataPrivacySlug;

        if (locale && locale === 'all') {
          const translationRawFileDe = (await import('../../../i18n/messages/de.json', {
            with: {
              type: 'json',
            },
          })).default;
          const translationRawFileEn = (await import('../../../i18n/messages/en.json', {
            with: {
              type: 'json',
            },
          })).default;
          const translationRawFileFr = (await import('../../../i18n/messages/fr.json', {
            with: {
              type: 'json',
            },
          })).default;
          const translationRawFileIt = (await import('../../../i18n/messages/it.json', {
            with: {
              type: 'json',
            },
          })).default;

          dataPrivacySlug = {
            de: translationRawFileDe.slugs.dataPrivacy,
            en: translationRawFileEn.slugs.dataPrivacy,
            fr: translationRawFileFr.slugs.dataPrivacy,
            it: translationRawFileIt.slugs.dataPrivacy,
          };

        } else if (locale) {
          // Use static string literals in switch for webpack static analysis
          let translationsFile;

          switch (locale) {
            case 'de':
              translationsFile = (await import('../../../i18n/messages/de.json', {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            case 'en':
              translationsFile = (await import('../../../i18n/messages/en.json', {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            case 'fr':
              translationsFile = (await import('../../../i18n/messages/fr.json', {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            case 'it':
              translationsFile = (await import('../../../i18n/messages/it.json', {
                with: {
                  type: 'json',
                },
              })).default;
              break;
            default:
              translationsFile = (await import('../../../i18n/messages/de.json', {
                with: {
                  type: 'json',
                },
              })).default;
          }

          dataPrivacySlug = translationsFile.slugs.dataPrivacy;
        }

        return {
          ...doc,
          slug: dataPrivacySlug || fallback,
        };
      },
    ],
    beforeChange: [hookPreventBulkPublishForTranslators],
    beforeValidate: [hookPreventBlockStructureChangesForTranslators()],
  },
  labels: {
    plural: 'Data Privacy',
    singular: 'Data Privacy',
  },
  slug: 'dataPrivacyPage',
  versions,
};
