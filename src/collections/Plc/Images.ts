import type { CollectionConfig } from 'payload';
import { assetsAccess } from '@/access/assets';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';
import { lockDocuments } from '@/field-templates/lockDocuments';

export const Images: CollectionConfig = {
  access: assetsAccess,
  admin: {
    description: `
      We are using an image optimization service to transform your image
      into all required renditions (image sizes). Please ensure
      that the dimensions of the uploaded image does not exceed 4000 pixels
      in either direction. Allowed image formats are «png, jpg, jpeg, gif,
      webp, avif and svg». Since the optimization service will compress the
      renditions again, it is best to not compress the image too much before
      you upload it.`,
    group: 'Assets',
    hideAPIURL: process.env.ENV === 'prod',
  },
  defaultPopulate: {
    // files uploaded in the admin are stored in a folder named after
    // _objectKey. the storage plugin needs it to build the url. without
    // it, populated images get a url without the folder (404).
    /* eslint-disable @typescript-eslint/naming-convention */
    _objectKey: true,
    /* eslint-enable @typescript-eslint/naming-convention */
    alt: true,
    filename: true,
    focalX: true,
    focalY: true,
    height: true,
    mimeType: true,
    tenant: true,
    url: true,
    width: true,
  },
  fields: [
    {
      localized: true,
      name: 'alt',
      required: true,
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  lockDocuments,
  slug: 'images',
  upload: {
    crop: false,
    focalPoint: true,
    mimeTypes: [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/avif',
      'image/svg+xml',
    ],
  },
};
