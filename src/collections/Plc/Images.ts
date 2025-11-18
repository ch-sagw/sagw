import type { CollectionConfig } from 'payload';
import { assetsAccess } from '@/access/assets';

export const Images: CollectionConfig = {
  access: assetsAccess,
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
    ],
  },
};
