import type {
  BasePayload, CollectionSlug,
} from 'payload';
import type {
  Config, InterfaceBreadcrumb, InterfacePageUrls, Tenant,
} from '@/payload-types';
import { localizationConfig } from '@/i18n/payloadConfig';
import { generateAllPageUrls } from './generateAllPageUrls';
import { HOME_SLUG } from '@/collections/Pages/Singletons/Home';
import { fetchLocalizedSlugs } from './fetchLocalizedSlugs';

type Locale = Config['locale'];

// Helper function to generate URLs for singleton pages
export const generateSingletonUrls = async (
  payload: BasePayload,
  relationTo: CollectionSlug,
  documentId: string,
): Promise<InterfacePageUrls | null> => {
  try {
    const locales = localizationConfig.locales.map((locale) => {
      if (typeof locale === 'object' && 'code' in locale) {
        return locale.code as Locale;
      }

      return locale as Locale;
    });

    // Fetch singleton for default locale to get non-localized fields
    const defaultLocale = localizationConfig.defaultLocale as Locale;
    const baseDoc = await payload.findByID({
      collection: relationTo,
      id: documentId,
      locale: defaultLocale,
    }) as unknown as Record<string, unknown>;

    if (!baseDoc) {
      return null;
    }

    // Fetch slug for each locale individually
    const localizedSlug = await fetchLocalizedSlugs(
      payload,
      relationTo,
      documentId,
      locales,
    );

    // Generate URLs for all locales
    const generatedUrls = await generateAllPageUrls({
      page: {
        breadcrumb: (baseDoc.breadcrumb as InterfaceBreadcrumb | undefined) || null,
        id: documentId,
        slug: Object.keys(localizedSlug).length > 0
          ? localizedSlug
          : HOME_SLUG,
        tenant: (baseDoc.tenant as Tenant | string | undefined) || null,
      },
      payload,
    });

    return generatedUrls;
  } catch (error) {
    console.error(`Error generating URLs for singleton ${relationTo}:`, error);

    return null;
  }
};

