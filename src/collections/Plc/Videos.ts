import type { CollectionConfig } from 'payload';
import { assetsAccess } from '@/access/assets';
import {
  deleteVideoFromGumlet,
  syncVideoWithGumlet,
} from '@/hooks-payload/syncVideoWithGumlet';
import {
  hookInvalidateCacheOnReferencedCollectionChange,
  hookInvalidateCacheOnReferencedCollectionDelete,
} from '@/hooks-payload/invalidateCacheOnReferencedCollectionChange';

// TODO:
// - discuss: subtitles

export const Videos: CollectionConfig = {
  access: assetsAccess,
  admin: {
    description: `
      Storing videos requires a lot of disk space, especially in backups.
      Please ensure that your video does not exceed 50 MB in size and 5 Mins in length.
      Please upload videos in the format 16/9.
    `,
    group: 'Assets',
    hideAPIURL: process.env.ENV === 'prod',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            {
              localized: true,
              name: 'title',
              required: true,
              type: 'text',
            },
            {
              admin: {
                description: 'Enter video duration in seconds',
              },
              name: 'duration',
              type: 'number',
            },
            {
              admin: {
                readOnly: true,
              },
              name: 'gumletAssetId',
              type: 'text',
            },
          ],
          label: 'Video properties',
        },
      ],
      type: 'tabs',
    },
  ],
  hooks: {
    afterChange: [
      hookInvalidateCacheOnReferencedCollectionChange,
      syncVideoWithGumlet,
    ],
    afterDelete: [
      hookInvalidateCacheOnReferencedCollectionDelete,
      deleteVideoFromGumlet,
    ],
    beforeChange: [
      ({
        req,
      }): void => {
        // We temporarily logging the mime type of the video
        // on upload to debug the mime type error message which
        // randomly appears.
        console.log(`Mimetype of upload ${req.file?.mimetype}`);
      },
    ],
  },
  slug: 'videos',
  upload: {
    mimeTypes: ['video/*'],
  },
};
