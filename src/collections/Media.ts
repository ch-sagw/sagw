import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  access: {
    read: () => true,
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
