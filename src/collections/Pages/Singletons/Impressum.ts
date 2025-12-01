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
    beforeValidate: [hookPreventBlockStructureChangesForTranslators()],
  },
  labels: {
    plural: 'Impressum',
    singular: 'Impressum',
  },
  slug: 'impressumPage',
  versions,
};
