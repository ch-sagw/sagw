import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { Plugin } from 'payload';
import { Media } from '@/collections/Media';

const plugins: Plugin[] = [
  vercelBlobStorage({
    clientUploads: true,
    collections: {
      [Media.slug]: true,
    },
    enabled: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
];

export default plugins;
