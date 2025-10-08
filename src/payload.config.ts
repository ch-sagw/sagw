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
import { blocks } from '@/blocks';
import { Users } from '@/collections/Plc/Users';
import { seedInitialUserAndTenant } from '@/seed/init';
import { seedTestData } from '@/seed/test-data';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    autoLogin:
      process.env.NEXT_PUBLIC_ENABLE_AUTOLOGIN === 'true'
        ? {
          email: process.env.PAYLOAD_INITIAL_USER_MAIL,
          password: process.env.PAYLOAD_INITIAL_PASSWORD,
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
  blocks: blocks(),
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
    fallbackLanguage: 'de',
    supportedLanguages: {
      de,
      en,
    },
  },
  localization: {
    defaultLocale: 'de',
    fallback: true,
    filterAvailableLocales: async ({
      req, locales,
    }) => {

      // filter available languages based on the chosen languages
      // in the specific tenant config

      const tenant = getTenantFromCookie(req.headers, 'text');

      if (!tenant) {
        return locales;
      }

      try {
        const fullTenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenant,
          req,
        });

        const tenantLanguages = fullTenant.languages;

        if (tenantLanguages === undefined) {
          return locales;
        }

        return locales.filter((locale) => tenantLanguages[locale.code as keyof typeof tenantLanguages]);

      } catch {
        return locales;
      }
    },
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
  onInit: async (payload) => {
    // on ENV seed, we seed test data. otherwise we seed initial user
    // and tenant (if user and tenant collections are empty)
    if (process.env.ENV === 'seed' || process.env.ENV === 'playwright') {
      await seedTestData(payload);
    } else {
      await seedInitialUserAndTenant(payload);
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
