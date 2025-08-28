import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { TextBlock } from '@/blocks/Text';
import { ImageBlock } from '@/blocks/Image';
import { VideoBlock } from '@/blocks/Video';
import { DownloadsBlock } from '@/blocks/Downloads';
import { LinksBlock } from '@/blocks/Links';
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

export const MagazineDetailPage: CollectionConfig = {
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

            // Overview Page properties
            {
              fields: [
                {
                  localized: true,
                  name: 'teaserText',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Hero
            fieldsHero([
              {
                localized: true,
                name: 'author',
                required: true,
                type: 'text',
              },
              {
                localized: true,
                name: 'date',
                required: true,
                type: 'date',
              },
            ]),

            // Content
            {
              blocks: [
                TextBlock,
                ImageBlock,
                VideoBlock,
                DownloadsBlock,
                LinksBlock,
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
    plural: 'Magazine Detail Pages',
    singular: 'Magazine Detail',
  },
  slug: 'magazineDetailPage',
};
