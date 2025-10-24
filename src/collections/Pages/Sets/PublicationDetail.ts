import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHero } from '@/field-templates/hero';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitle, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { hookSeoFallback } from '@/hooks-payload/seoFallback';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';
import { fieldSlug } from '@/field-templates/slug';
import { hookSlug } from '@/hooks-payload/slug';

export const PublicationDetailPage: CollectionConfig = {
  access: {
    read: (): boolean => true,
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

            // Overview Page properties
            {
              fields: [
                {
                  admin: {
                    description: 'This image will be used for the teasers on the overview page.',
                  },
                  name: 'image',
                  relationTo: 'images',
                  required: true,
                  type: 'relationship',
                },
                {
                  name: 'date',
                  required: true,
                  type: 'date',
                },
              ],
              label: 'Overview Page properties',
              name: 'overviewPageProps',
              type: 'group',
            },

            // Categorization
            {
              fields: [
                {
                  fields: [
                    {
                      admin: {
                        width: '33.33%',
                      },
                      name: 'topic',
                      relationTo: 'publicationTopics',
                      required: false,
                      type: 'relationship',
                    },
                    {
                      admin: {
                        width: '33.33%',
                      },
                      name: 'type',
                      relationTo: 'publicationTypes',
                      required: false,
                      type: 'relationship',
                    },
                    {
                      admin: {
                        width: '33.33%',
                      },
                      name: 'project',
                      relationTo: 'projects',
                      required: false,
                      type: 'relationship',
                    },
                  ],
                  type: 'row',
                },
              ],
              label: 'Categorization',
              name: 'categorization',
              type: 'group',
            },

            // Hero
            fieldsHero,

            // Content Blocks
            {
              blocks: blocks([
                'textBlock',
                'linksBlock',
                'downloadsBlock',
                'formBlock',
                'bibliographicReferenceBlock',
                'notificationBlock',
                'publicationsTeasersBlock',
              ]),
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
    beforeChange: [hookSeoFallback],
    beforeValidate: [
      hookAdminTitle,
      hookSlug,
    ],
  },
  labels: {
    plural: 'Publication Detail Pages',
    singular: 'Publication Detail',
  },
  slug: 'publicationDetailPage',
  versions,
};
