import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';
import { pageAccess } from '@/access/pages';
import { hookPreventBulkPublishForTranslators } from '@/hooks-payload/preventBulkPublishForTranslators';

export const ErrorPage: CollectionConfig = {
  access: pageAccess,
  admin: {
    group: 'Pages',
    hideAPIURL: process.env.ENV === 'prod',
  },
  fields: [
    {
      tabs: [

        // Content Tab
        {
          fields: [
            rte1({
              label: 'Back to Home Button',
              name: 'homeButtonText',
            }),

            // 400
            {
              fields: [
                rte1({
                  name: 'title',
                }),
                rte1({
                  name: 'description',
                }),
              ],
              label: '400',
              name: 'error400',
              type: 'group',
            },

            // 500
            {
              fields: [
                rte1({
                  name: 'title',
                }),
                rte1({
                  name: 'description',
                }),
              ],
              label: '500',
              name: 'error500',
              type: 'group',
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
    beforeChange: [hookPreventBulkPublishForTranslators],
  },
  labels: {
    plural: 'Error Page',
    singular: 'Error Page',
  },
  slug: 'errorPage',
  versions,
};
