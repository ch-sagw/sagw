import dotenv from 'dotenv';

dotenv.config({
  override: true,
  path: `.env.${process.env.ENV}`,
});

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { resendAdapter } from '@payloadcms/email-resend';
import { buildConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor(),
  email: resendAdapter({
    apiKey: process.env.RESEND_KEY || '',
    defaultFromAddress: 'cms@sagw.ch',
    defaultFromName: 'Payload CMS',
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      enabled: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
