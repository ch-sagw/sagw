import { CollectionConfig } from 'payload';

export const PublicationTopics: CollectionConfig = {
  admin: {
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
  ],
  slug: 'publicationTopics',
};
