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
import { collections } from '@/collections';
import { Users } from '@/collections/Plc/Users';

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
        code: 'it',
        label: 'Italiano',
      },
      {
        code: 'en',
        label: 'English',
      },
    ],
  },
  onInit: async (cms) => {
    try {
    // Check if any users exist
      const users = await cms.find({
        collection: 'users',
        limit: 1,
      });

      if (users.docs.length === 0) {
        console.log('No users found. Seeding first tenant and admin user...');

        // Create a default tenant
        const tenant = await cms.create({
          collection: 'departments',
          data: {
            name: 'SAGW',
            slug: 'sagaw',
          },
        });

        // 3. Create the first admin user and link them to the tenant
        if (process.env.PAYLOAD_INITIAL_USER_MAIL && process.env.PAYLOAD_INITIAL_PASSWORD) {
          await cms.create({
            collection: 'users',
            data: {
              department: tenant.id,
              departments: [
                {
                  department: tenant.id,
                  roles: ['admin'],
                },
              ],
              email: process.env.PAYLOAD_INITIAL_USER_MAIL,
              password: process.env.PAYLOAD_INITIAL_PASSWORD,
              roles: ['global-admin'],
              username: 'init-user',
            },
          });

          console.log('Created first user.');
        } else {
          console.log('Payload init error: PAYLOAD_INITIAL_USER_MAIL & PAYLOAD_INITIAL_PASSWORD env vars must be defined');
        }
      }
    } catch (e) {
      console.log('payload init: something went wrong creating initial user and tenant.');
      console.log(e);
    }
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      // 50MB, written in bytes
      fileSize: 50000000,
    },
  },
});
