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
import { hookGenerateRteLinkPaths } from '@/hooks-payload/generateRteLinkPaths/blocks';

const contentBlocks: BlockSlug[] = ['textBlock'];

export const ImpressumPage: CollectionConfig = {
  access: pageAccess,
  admin: {
    group: 'Pages',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Impressum'),
    {
      admin: {
        hidden: true,
        readOnly: true,
      },

      // TODO: get from internal i18n
      defaultValue: {
        de: 'impressum-de',
        en: 'impressum-en',
        fr: 'impressum-fr',
        it: 'impressum-it',
      },
      localized: true,
      name: 'slug',
      type: 'text',
    },
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
    ],
  },
  labels: {
    plural: 'Impressum',
    singular: 'Impressum',
  },
  slug: 'impressumPage',
  versions,
};
