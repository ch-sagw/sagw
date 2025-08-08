import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
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
  slug: 'media',
  upload: {
    focalPoint: true,
  },
};
