import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

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
    mimeTypes: [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/avif',
      'image/tiff',
    ],
  },
  versions,
};
