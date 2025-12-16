import type {
  BasePayload, CollectionSlug,
} from 'payload';
import type { Config } from '@/payload-types';

type Locale = Config['locale'];

// Helper function to fetch localized slugs for a singleton document
export const fetchLocalizedSlugs = async (
  payload: BasePayload,
  collection: CollectionSlug,
  documentId: string,
  locales: Locale[],
): Promise<Partial<Record<Locale, string>>> => {
  const slugPromises = locales.map(async (locale) => {
    try {
      const localeDoc = await payload.findByID({
        collection,
        fallbackLocale: false,
        id: documentId,
        locale,
      });

      if (!localeDoc || typeof localeDoc !== 'object') {
        return {
          locale,
          slug: null,
        };
      }

      const docWithSlug = localeDoc as { slug?: string | Partial<Record<Locale, string>> | null };
      const {
        slug: docSlug,
      } = docWithSlug;
      let slug: string | null = null;

      if (typeof docSlug === 'string') {
        slug = docSlug;
      } else if (docSlug && typeof docSlug === 'object' && locale in docSlug) {
        const localizedSlug = docSlug[locale];

        slug = typeof localizedSlug === 'string'
          ? localizedSlug
          : null;
      }

      return {
        locale,
        slug,
      };
    } catch {
      return {
        locale,
        slug: null,
      };
    }
  });

  const slugResults = await Promise.all(slugPromises);
  const localizedSlug: Partial<Record<Locale, string>> = {};

  slugResults.forEach(({
    locale, slug,
  }) => {
    if (slug) {
      localizedSlug[locale] = slug;
    }
  });

  return localizedSlug;
};

