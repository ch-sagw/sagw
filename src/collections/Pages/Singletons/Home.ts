import { CollectionConfig } from 'payload';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { HomeTeasersBlock } from '@/blocks/HomeTeasers';
import { NewsTeasersBlock } from '@/blocks/NewsTeasers';
import { DownloadsBlock } from '@/blocks/Downloads';
import { LinksBlock } from '@/blocks/Links';

export const HomePage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Home Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [
            fieldsHero([
              {
                // TODO: enable for SAGW only
                defaultValue: true,
                name: 'animated',
                type: 'checkbox',
              },
              {
                localized: true,
                name: 'sideTitle',
                required: true,
                type: 'text',
              },
              fieldsLinkInternalWithToggle,
            ]),
            {
              blocks: [
                HomeTeasersBlock,
                NewsTeasersBlock,
                DownloadsBlock,
                LinksBlock,
              ],
              label: 'Content',
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
  labels: {
    plural: 'Home',
    singular: 'Home',
  },
  slug: 'homePage',
};
