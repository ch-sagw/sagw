import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const EventCategories: CollectionConfig = {
  admin: {
    defaultColumns: ['eventCategory'],
    group: 'Global Content',
    useAsTitle: 'eventCategory',
  },
  fields: [
    {
      localized: true,
      name: 'eventCategory',
      required: true,
      type: 'text',
    },
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
  slug: 'eventCategory',
  versions,
};
