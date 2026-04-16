import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';
import { lockDocuments } from '@/field-templates/lockDocuments';

export const PublicationTopics: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    defaultColumns: ['publicationTopic'],
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'publicationTopic',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            rte1({
              name: 'publicationTopic',
            }),
          ],
          label: 'Publication Topic',
        },
        {
          fields: [
            {
              admin: {
                allowCreate: false,
              },
              collection: 'publicationDetailPage',
              name: 'relatedPublicationPages',
              on: 'categorization.topic',
              type: 'join',
            },
          ],
          label: 'Related Content',
        },
      ],
      type: 'tabs',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  lockDocuments,
  slug: 'publicationTopics',
};
