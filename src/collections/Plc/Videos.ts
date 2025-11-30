import {
  APIError, type CollectionConfig,
} from 'payload';
import { assetsAccess } from '@/access/assets';
import { deleteBlob } from '@/utilities/blob';

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
    beforeValidate: [
      async ({
        data,
      }): Promise<any> => {
        const maxFileSize = 2;

        if (data && data.filesize) {
          const fileSizeInMb = data.filesize / 1000 / 1000;

          if (fileSizeInMb > maxFileSize) {

            /*
              !DAMN! Even if we return an error, the file will still be
              uploaded to vercel blob, but not to the db. So we need to
              manually delete it from vercel blob!
            */
            if (data.filename) {
              await deleteBlob(data.filename);
            }

            throw new APIError(`Allowed max size is ${maxFileSize}MB`, 400);
          }
        }

        return data;
      },
    ],
  },
  slug: 'videos',
  upload: {
    allowRestrictedFileTypes: true,
    mimeTypes: ['video/*'],
  },
};
