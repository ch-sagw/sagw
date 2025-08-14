import { CollectionConfig } from 'payload';

export const EventCategories: CollectionConfig = {
  admin: {
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
  ],
  slug: 'eventCategory',
};
