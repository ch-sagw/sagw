import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks-payload/seoFallback';
import { superAdminOrTenantAdminAccess } from '@/collections/Pages/access/superAdminOrTenantAdmin';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';
import { fieldSlug } from '@/field-templates/slug';
import { hookSlug } from '@/hooks-payload/slug';
import { createSingleOverviewBlockFilter } from '@/utilities/blockFilters';
import { allowSingleOverviewBlock } from '@/hooks-payload/allowSingleOverviewBlock';

const contentBlocks = [
  'textBlock',
  'accordionBlock',
  'formBlock',
  'ctaContactBlock',
  'ctaLinkBlock',
  'notificationBlock',
  'networkTeasersBlock',
  'genericTeasersBlock',
  'projectsOverviewBlock',
  'magazineOverviewBlock',
  'publicationsOverviewBlock',
  'eventsOverviewBlock',
  'peopleOverviewBlock',
  'newsOverviewBlock',
  'institutesOverviewBlock',
  'nationalDictionariesOverviewBlock',
  'projectsTeasersBlock',
  'eventsTeasersBlock',
  'magazineTeasersBlock',
  'newsTeasersBlock',
  'publicationsTeasersBlock',
] as const;

export const OverviewPage: CollectionConfig = {
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: () => true,
    update: superAdminOrTenantAdminAccess,
  },
  admin: {
    defaultColumns: [
      'adminTitle',
      'slug',
      'updatedAt',
      '_status',
    ],
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitle,
    fieldSlug,
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            fieldsHero,

            // Content Blocks
            {
              blocks: blocks(contentBlocks),
              filterOptions: createSingleOverviewBlockFilter(contentBlocks),
              label: 'Content',
              name: 'content',
              type: 'blocks',
              validate: allowSingleOverviewBlock,
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
    beforeChange: [hookSeoFallback],
    beforeValidate: [
      hookAdminTitle,
      hookSlug,
    ],
  },
  labels: {
    plural: 'Overview Pages',
    singular: 'Overview Page',
  },
  slug: 'overviewPage',
  versions,
};
