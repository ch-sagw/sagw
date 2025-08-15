import { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  admin: {
    group: 'Global Content',
    useAsTitle: 'name',
  },
  fields: [
    {
      localized: true,
      name: 'name',
      required: true,
      type: 'text',
    },
  ],
  slug: 'projects',
};
