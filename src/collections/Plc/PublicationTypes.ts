import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const PublicationTypes: CollectionConfig = {
  admin: {
    defaultColumns: ['publicationType'],
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
  versions,
};
