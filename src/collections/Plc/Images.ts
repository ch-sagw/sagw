import type { CollectionConfig } from 'payload';

export const Images: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Assets',
  },
  fields: [
    {
      localized: true,
      name: 'alt',
      required: false,
      type: 'text',
    },
  ],
  slug: 'images',
  upload: {
    focalPoint: true,
  },
};
