import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/TextBlock';
import { ImageBlock } from '@/blocks/ImageBlock';
import { VideoBlock } from '@/blocks/VideoBlock';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks/seoFallback';
import {
  createAccess, globalAdminOrDepartmentAdminAccess,
} from '@/collections/Pages/access/globalAdminOrDepartmentAdmin';

export const OverviewPage: CollectionConfig = {
  access: {
    create: createAccess,
    delete: globalAdminOrDepartmentAdminAccess,
    read: () => true,
    update: globalAdminOrDepartmentAdminAccess,
  },
  admin: {
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitle,
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero(),

            // Content
            {
              blocks: [
                TextBlock,
                ImageBlock,
                VideoBlock,
              ],
              label: 'Content Blocks',
              name: 'contentBlocks',
              type: 'blocks',
            },
          ],
          label: 'Content',
        },

        // Meta Tabs
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  hooks: {
    beforeChange: [hookSeoFallback],
    beforeValidate: [hookAdminTitle],
  },
  labels: {
    plural: 'Overview Pages',
    singular: 'Overview Page',
  },
  slug: 'overview',
};
