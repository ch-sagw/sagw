import { CollectionConfig } from 'payload';

export const PublicationTypes: CollectionConfig = {
  admin: {
    group: 'Global Content',
    useAsTitle: 'publicationType',
  },
  fields: [
    {
      localized: true,
      name: 'publicationType',
      required: true,
      type: 'text',
    },
  ],
  slug: 'publicationTypes',
};
