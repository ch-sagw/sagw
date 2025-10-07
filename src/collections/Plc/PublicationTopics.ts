import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const PublicationTopics: CollectionConfig = {
  admin: {
    defaultColumns: ['publicationTopic'],
    group: 'Global Content',
    useAsTitle: 'publicationTopic',
  },
  fields: [
    {
      localized: true,
      name: 'publicationTopic',
      required: true,
      type: 'text',
    },
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
  versions,
};
