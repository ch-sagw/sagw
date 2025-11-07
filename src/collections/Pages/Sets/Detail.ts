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
import { excludeBlocksFilterSingle } from '@/utilities/blockFilters';
import { validateUniqueBlocksSingle } from '@/hooks-payload/validateUniqueBlocks';
// import { fieldBreadcrumbs } from '@/field-templates/breadcrumbs';
import { hookValidateParentCircularReference } from '@/hooks-payload/validateParentCircularReference';

// import { hookGenerateBreadcrumbs }
// from '@/hooks-payload/generateBreadcrumbs';
// import { hookCascadeBreadcrumbUpdates } from
// '@/hooks-payload/cascadeBreadcrumbUpdates';

import { fieldInternalLinkChooser } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';

const contentBlocks = [
  'textBlock',
  'footnoteBlock',
  'linksBlock',
  'downloadsBlock',
  'imageBlock',
  'videoBlock',
  'accordionBlock',
  'formBlock',
  'ctaContactBlock',
  'ctaLinkBlock',
  'notificationBlock',
  'genericTeasersBlock',
] as const;

type ContentBlock = typeof contentBlocks[number];

const uniqueBlocks: ContentBlock[] = [
  'downloadsBlock',
  'linksBlock',
];

export const DetailPage: CollectionConfig = {
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
    fieldInternalLinkChooser({
      linkableCollections: [
        'detailPage',
        'overviewPage',
        'homePage',
      ],
      name: 'parentPage',
    }),
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
              filterOptions: excludeBlocksFilterSingle({
                allBlockTypes: contentBlocks,
                onlyAllowedOnceBlockTypes: uniqueBlocks,
              }),
              label: 'Content',
              name: 'content',
              type: 'blocks',
              validate: validateUniqueBlocksSingle({
                onlyAllowedOnceBlockTypes: uniqueBlocks,
              }),
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
    // afterChange: [hookCascadeBreadcrumbUpdates],
    beforeChange: [
      hookSeoFallback,
      // hookGenerateBreadcrumbs,
    ],
    beforeValidate: [
      hookAdminTitle,
      hookSlug,
      hookValidateParentCircularReference,
    ],
  },
  labels: {
    plural: 'Detail Pages',
    singular: 'Detail Page',
  },
  slug: 'detailPage',
  versions,
};
