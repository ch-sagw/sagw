import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';

export const EventCategories: CollectionConfig = {
  admin: {
    defaultColumns: ['eventCategory'],
    group: 'Global Content',
    useAsTitle: 'eventCategory',
  },
  fields: [
    rte1({
      name: 'eventCategory',
    }),
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
};
