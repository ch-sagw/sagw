import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';

export const PublicationTypes: CollectionConfig = {
  admin: {
    defaultColumns: ['publicationType'],
    group: 'Global Content',
    useAsTitle: 'publicationType',
  },
  fields: [
    rte1({
      name: 'publicationType',
    }),
    {
      admin: {
        allowCreate: false,
      },
      collection: 'publicationDetailPage',
      name: 'relatedPublicationPages',
      on: 'categorization.type',
      type: 'join',
    },
  ],
  slug: 'publicationTypes',
};
