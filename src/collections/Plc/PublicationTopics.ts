import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';

export const PublicationTopics: CollectionConfig = {
  admin: {
    defaultColumns: ['publicationTopic'],
    group: 'Global Content',
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
