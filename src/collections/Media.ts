import { CollectionConfig } from 'payload';
import { put } from '@vercel/blob';
import fs from 'fs/promises';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const Media: CollectionConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      admin: {
        readOnly: true,
      },
      label: 'Vercel Blob URL',
      name: 'blobURL',
      type: 'text',
    },
    {
      name: 'alt',
      required: true,
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [
      async ({
        req,
        doc,
      }): Promise<void> => {
        const file = (req as any)?.files?.file;

        if (!file) {
          return;
        }

        const buffer = await fs.readFile(file.path);
        const blob = await put(doc.filename, buffer, {
          access: 'public',
        });

        await (req as any).payload.update({
          collection: 'media',
          data: {
            blobURL: blob.url as string,
          },
          id: doc.id,
        });

        await fs.unlink(file.path);
      },
    ],
    beforeChange: [
      ({
        req,
      }): void => {
        const file = (req as any)?.files?.file;

        if (file && file.size > MAX_FILE_SIZE) {
          throw new Error(`File too large. Max is ${MAX_FILE_SIZE / (1024 * 1024)} MB`);
        }
      },
    ],
  },
  slug: 'media',
  upload: true,
};
