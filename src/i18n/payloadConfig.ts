import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';
import { LocalizationConfig } from 'payload';
import type { Config } from '@/payload-types';

export const localizationConfig: LocalizationConfig = {
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
};

// Extract locale codes from localization config
export const getLocaleCodes = (): Config['locale'][] => localizationConfig.locales.map((locale) => (typeof locale === 'object' && 'code' in locale
  ? locale.code
  : locale)) as Config['locale'][];
