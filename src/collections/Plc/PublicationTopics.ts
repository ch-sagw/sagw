import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

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
  versions,
};
