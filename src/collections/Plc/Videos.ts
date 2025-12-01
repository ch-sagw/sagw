import type { CollectionConfig } from 'payload';
import { assetsAccess } from '@/access/assets';

// TODO:
// - discuss: subtitles

export const Videos: CollectionConfig = {
  access: assetsAccess,
  admin: {
    group: 'Assets',
    hideAPIURL: process.env.ENV === 'prod',
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
  ],
  slug: 'videos',
  upload: {
    mimeTypes: ['video/*'],
  },
};
