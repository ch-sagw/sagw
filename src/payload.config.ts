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
import { seedTestData } from '@/seed/test-data';
import { seedTenantsAndUsers } from '@/seed/seedTenantsAndUsers/index';
import { localizationConfig } from '@/i18n/payloadConfig';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    autoLogin:
      process.env.NEXT_PUBLIC_ENABLE_AUTOLOGIN === 'true'
        ? {
          email: process.env.USER_SAGW_ADMIN_MAIL,
          password: process.env.USER_SAGW_ADMIN_PASS,
          prefillOnly: false,
        }
        : false,
    components: {
      beforeDashboard: ['@/components/admin/EnvIndicator'],
      graphics: {
        Icon: '@/components/admin/graphics/Icon',
        Logo: '@/components/admin/graphics/Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections,
  db: mongooseAdapter({
    autoPluralization: false,
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
    fallbackLanguage: 'en',
    supportedLanguages: {
      de,
      en,
    },
  },
  localization: localizationConfig,
  onInit: async (payload) => {
    // on ENV seed or playwright, we seed test data. otherwise we seed initial
    // user and tenant (if user and tenant collections are empty)

    // TODO: this runs everytime we import config promise into another file
    // this has negative impact on performance.
    // -> solved for playwright tests (e.g. links.be.spec.ts imports the
    // the config. we use an env variable in playwright be config as flag)
    // -> NOT SOLVED FOR PAYLOAD APP: e.g. in events/news teasers and overviews,
    // we import the config. find solution.
    if (process.env.ENV === 'seed' || process.env.ENV === 'playwright') {
      await seedTestData(payload);
    } else {
      await seedTenantsAndUsers({
        payload,
      });
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
