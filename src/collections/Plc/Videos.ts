import type { CollectionConfig } from 'payload';
import { assetsAccess } from '@/access/assets';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';

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
  hooks: {
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  slug: 'videos',
  upload: {
    mimeTypes: ['video/*'],
  },
};
