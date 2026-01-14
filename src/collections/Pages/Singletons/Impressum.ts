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
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import {
  dirname, join,
} from 'path';

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

          impressumSlug = {
            de: JSON.parse(translationRawFileDe).slugs.impressum,
            en: JSON.parse(translationRawFileEn).slugs.impressum,
            fr: JSON.parse(translationRawFileFr).slugs.impressum,
            it: JSON.parse(translationRawFileIt).slugs.impressum,
          };

        } else if (locale) {
          const translationRawFile = (await readFile(join(messagesDir, `${locale}.json`))).toString();
          const translationsFile = JSON.parse(translationRawFile);

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
