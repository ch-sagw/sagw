import type { CollectionConfig } from 'payload';
import { assetsAccess } from '@/access/assets';

export const Images: CollectionConfig = {
  access: assetsAccess,
  admin: {
    description: `
      We are using an image optimization service to transform your image
      into all required renditions (image sizes). Please ensure
      that the dimensions of the uploaded image does not exceed 4000 pixels
      in either direction. Allowed image formats are «png, jpg, jpeg, gif,
      webp, avif». Since the optimization service will compress the
      renditions again, it is best to not compress the image too much before
      you upload it.`,
    group: 'Assets',
    hideAPIURL: process.env.ENV === 'prod',
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
