import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const Images: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    description: 'Allowed image formats: png, jpg, jpeg, gif, webp, avif, tiff',
    group: 'Assets',
  },
  fields: [
    {
      localized: true,
      name: 'alt',
      required: true,
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
