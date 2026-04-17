import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';
import { lockDocuments } from '@/field-templates/lockDocuments';

export const EventCategories: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    defaultColumns: ['eventCategory'],
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'eventCategory',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            rte1({
              name: 'eventCategory',
            }),
          ],
          label: 'Event Category',
        },
        {
          fields: [
            {
              admin: {
                allowCreate: false,
              },
              collection: 'eventDetailPage',
              name: 'relatedEventPages',
              on: 'eventDetails.category',
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
  slug: 'eventCategory',
};
