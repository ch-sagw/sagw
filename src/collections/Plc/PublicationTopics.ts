import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';

export const PublicationTopics: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    defaultColumns: ['publicationTopic'],
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'publicationTopic',
  },
  fields: [
    rte1({
      name: 'publicationTopic',
    }),
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
  slug: 'publicationTopics',
};
