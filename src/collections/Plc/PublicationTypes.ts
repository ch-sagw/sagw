import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';

export const PublicationTypes: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    defaultColumns: ['publicationType'],
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
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
