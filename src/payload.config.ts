import '../.env/index';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { resendAdapter } from '@payloadcms/email-resend';
import { de } from '@payloadcms/translations/languages/de';
import { en } from '@payloadcms/translations/languages/en';
import { buildConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import plugins from '@/plugins';
import collections from '@/collections';
import { Users } from '@/collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    autoLogin:
      process.env.NEXT_PUBLIC_ENABLE_AUTOLOGIN === 'true'
        ? {
          email: 'foo@bar.com',
          password: '1234',
          prefillOnly: false,
        }
        : false,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  defaultDepth: 0,
  editor: lexicalEditor(),
  email: resendAdapter({
    apiKey: process.env.RESEND_KEY || '',
    defaultFromAddress: 'cms@sagw.ch',
    defaultFromName: 'Payload CMS',
  }),
  i18n: {
    fallbackLanguage: 'de',
    supportedLanguages: {
      de,
      en,
    },
  },
  localization: {
    defaultLocale: 'de',
    fallback: true,
    locales: [
      {
        code: 'de',
        label: 'Deutsch',
      },
      {
        code: 'fr',
        label: 'Français',
      },
      {
        code: 'en',
        label: 'English',
      },
    ],
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    debug: true,
    uploadTimeout: 0,
    useTempFiles: true,
  },
});
