import type { CollectionConfig } from 'payload';

export const Videos: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Content',
  },
  fields: [
    {
      localized: true,
      name: 'alt',
      required: false,
      type: 'text',
    },
  ],
  slug: 'videos',
  upload: true,
};
