import type { BasePayload } from 'payload';
import type {
  Config, InterfaceBreadcrumb, InterfacePageUrls, Tenant,
} from '@/payload-types';
import { generatePageUrl } from './generatePageUrl';
import { localizationConfig } from '@/i18n/payloadConfig';

type Locale = Config['locale'];

interface InterfaceGenerateAllPageUrlsParams {
  page: {
    id: string;
    slug: string | Partial<Record<Locale, string>>;
    breadcrumb?: InterfaceBreadcrumb | null;
    tenant?: Tenant | string | null;
  };
  payload: BasePayload;
}

// Generates URLs for a page in all 4 locales
export const generateAllPageUrls = async ({
  page,
  payload,
}: InterfaceGenerateAllPageUrlsParams): Promise<InterfacePageUrls> => {
  const locales = localizationConfig.locales.map((locale) => {
    if (typeof locale === 'object' && 'code' in locale) {
      return locale.code as Locale;
    }

    return locale as Locale;
  });

  const urls: Partial<Record<Locale, string | null>> = {};

  // Get tenant once (it's the same for all locales)
  const initialTenant = page.tenant;
  let tenantData: Tenant | string | null | undefined = initialTenant;

  if (initialTenant && typeof initialTenant === 'string') {
    // Fetch tenant by ID if needed
    try {
      tenantData = await payload.findByID({
        collection: 'tenants',
        id: initialTenant,
        locale: 'all',
      });
    } catch {
      tenantData = null;
    }
  }

  // Generate URL for each locale
  await Promise.all(locales.map(async (locale) => {
    try {
      const url = await generatePageUrl({
        locale,
        page: {
          breadcrumb: page.breadcrumb,
          slug: page.slug,
        },
        payload,
        tenant: tenantData,
      });

      urls[locale] = url;
    } catch (error) {
      console.error(`Error generating URL for locale ${locale}:`, error);
      urls[locale] = null;
    }
  }));

  return {
    de: urls.de || null,
    en: urls.en || null,
    fr: urls.fr || null,
    it: urls.it || null,
  };
};
