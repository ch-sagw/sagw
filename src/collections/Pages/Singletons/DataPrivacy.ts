import { CollectionConfig } from 'payload';
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
import { hookGenerateRteLinkPaths } from '@/hooks-payload/generateLinkPaths/rteLinks';
import { hookGenerateInternalLinkPaths } from '@/hooks-payload/generateLinkPaths/internalLinks';
import { readFile } from 'fs/promises';

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
      defaultValue: async ({
        locale,
      }): Promise<string> => {
        let dataPrivacySlug = 'dataPrivacy';

        if (locale) {
          const translationRawFile = (await readFile(new URL(`../../../i18n/messages/${locale}.json`, import.meta.url))).toString();
          const translationsFile = JSON.parse(translationRawFile);

          dataPrivacySlug = translationsFile.slugs.dataPrivacy;
        }

        return dataPrivacySlug;

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
    beforeChange: [hookPreventBulkPublishForTranslators],
    beforeValidate: [
      hookPreventBlockStructureChangesForTranslators(),
      hookGenerateRteLinkPaths,
      hookGenerateInternalLinkPaths,
    ],
  },
  labels: {
    plural: 'Data Privacy',
    singular: 'Data Privacy',
  },
  slug: 'dataPrivacyPage',
  versions,
};
