import type { BasePayload } from 'payload';
import type { Config } from '@/payload-types';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';
import {
  globalCollectionsSlugs, setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { urlFromBreadcrumb } from '@/utilities/urlFromBreadcrumb';
import {
  buildBreadcrumbsForDoc, InterfaceBreadcrumb,
} from '@/utilities/buildBreadcrumbs';
import { absoluteUrlFromPathname } from '@/utilities/getUrl';
import {
  getTenantHomeUrl,
  getTenantSlugFromPageDoc,
} from '@/utilities/tenant';
import {
  getLocaleCodes, localizationConfig,
} from '@/i18n/payloadConfig';

export interface InterfaceGetPageUrlParams {
  payload: BasePayload;
  pageId: string;
  locale: Config['locale'];
  absolute?: boolean;

  // When true (e.g. published-site URL after draft edits), resolve path from
  // published snapshots so breadcrumbs are not emptied by draft parents.
  usePublishedDocForPath?: boolean;

  // If true, when the page has no valid URL path in `locale` (e.g. no slug
  // for that locale), try the default locale and other locales in order so
  // the link matches i18n field fallback, instead of the tenant home in
  // `locale`. When false, missing paths fall back to tenant home, which
  // keeps e.g. language switcher (langnav) behavior intact.
  // Use case: 2 publication pages, first is in german and french, second
  // in french only. if you visit a page with publications overview/teaser
  // in french, then the link of the second teaser points to the page in
  // german rather than to the home.
  alternateLocaleForMissingPath?: boolean;

  // If set, do not use tenant home when the locale has no path; see
  // HREF_LANG_NO_EXACT_PATH (for hreflang: treat as "omit alternate").
  omitMissingPath?: boolean;
}

/** No exact URL in requested locale; used only with `omitMissingPath`. */
export const HREF_LANG_NO_EXACT_PATH = '\uE000';

// preferred order when resolving a path in another locale
const localeCandidateOrder = (requested: Config['locale']): Config['locale'][] => {
  const all = getLocaleCodes();
  const defaultL = localizationConfig.defaultLocale as Config['locale'];
  const ordered: Config['locale'][] = [
    requested,
    defaultL,
    ...all.filter((l) => l !== requested && l !== defaultL),
  ];
  const seen = new Set<Config['locale']>();

  return ordered.filter((l) => {
    if (seen.has(l)) {
      return false;
    }

    seen.add(l);

    return true;
  });
};

// normalizes a pageDoc.slug value into a Record<locale, slug>.
// returns null if no usable slug is present.
const slugRecordFromPageDoc = ({
  locale,
  pageDocRecord,
}: {
  locale: Config['locale'];
  pageDocRecord: Record<string, unknown>;
}): Record<string, string> | null => {
  const slugValue = pageDocRecord.slug;

  if (!slugValue) {
    return null;
  }

  if (typeof slugValue === 'string') {
    return {
      [locale]: slugValue,
    };
  }

  if (typeof slugValue === 'object') {
    return slugValue as Record<string, string>;
  }

  return null;
};

const urlForSingletonPage = ({
  alternateLocaleForMissingPath,
  breadcrumb,
  locale,
  pageDoc,
}: {
  alternateLocaleForMissingPath: boolean;
  breadcrumb: InterfaceBreadcrumb;
  locale: Config['locale'];
  pageDoc: any;
}): string | undefined => {
  const pageDocRecord = pageDoc as unknown as Record<string, unknown>;
  const slugRecord = slugRecordFromPageDoc({
    locale,
    pageDocRecord,
  });

  if (!slugRecord) {
    return undefined;
  }

  const tryLocales = alternateLocaleForMissingPath
    ? localeCandidateOrder(locale)
    : [locale];

  const tenant = getTenantSlugFromPageDoc(pageDocRecord) || '';

  for (const tryLocale of tryLocales) {
    const url = urlFromBreadcrumb({
      locale: tryLocale,
      page: {
        breadcrumb,
        slug: slugRecord,
      },
      tenant,
    });

    if (url !== undefined) {
      return url;
    }
  }

  return undefined;
};

const generatePageUrl = ({
  alternateLocaleForMissingPath,
  breadcrumb,
  locale,
  omitMissingPath,
  pageDoc,
}: {
  alternateLocaleForMissingPath: boolean;
  breadcrumb: InterfaceBreadcrumb;
  locale: Config['locale'];
  omitMissingPath: boolean;
  pageDoc?: unknown;
}): string => {
  try {
    if (!pageDoc) {
      return getRootPathUrls()[locale] || `/${locale}`;
    }

    const pageDocRecord = pageDoc as unknown as Record<string, unknown>;

    // if no path exists in the target locale, fall back to the tenant's
    // home in that locale; optional alternate-locale try matches list/teaser
    // links to field fallback, without changing e.g. langnav home fallback.
    const tenantHomeFallback = getTenantHomeUrl({
      locale,
      tenantSlug: getTenantSlugFromPageDoc(pageDocRecord),
    });

    const slugRecord = slugRecordFromPageDoc({
      locale,
      pageDocRecord,
    });

    if (!slugRecord) {
      return omitMissingPath
        ? HREF_LANG_NO_EXACT_PATH
        : tenantHomeFallback;
    }

    const tenant = getTenantSlugFromPageDoc(pageDocRecord) || null;
    const tryLocales = alternateLocaleForMissingPath
      ? localeCandidateOrder(locale)
      : [locale];

    for (const tryLocale of tryLocales) {
      const url = urlFromBreadcrumb({
        locale: tryLocale,
        page: {
          breadcrumb,
          slug: slugRecord,
        },
        tenant,
      });

      if (url !== undefined) {
        return url;
      }
    }

    return omitMissingPath
      ? HREF_LANG_NO_EXACT_PATH
      : tenantHomeFallback;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status !== 404) {
      console.error('Error generating page URL:', error);
    }

    return omitMissingPath
      ? HREF_LANG_NO_EXACT_PATH
      : (getRootPathUrls()[locale] || `/${locale}`);
  }
};

// gets URL for a page by fetching the page document and generating URL
export const getPageUrl = async ({
  payload,
  pageId,
  locale,
  absolute = true,
  alternateLocaleForMissingPath = false,
  omitMissingPath = false,
  usePublishedDocForPath = false,
}: InterfaceGetPageUrlParams): Promise<string> => {
  let pathname: string;

  const finish = (p: string): string => (p === HREF_LANG_NO_EXACT_PATH || !absolute
    ? p
    : absoluteUrlFromPathname(p));

  try {
    // try regular page collections first (sets and globals)
    const regularCollections = [
      ...setsSlugs,
      ...globalCollectionsSlugs,
    ];
    const regularResults = await Promise.allSettled(regularCollections.map(async (collectionConfig) => {
      try {
        const pageDoc = await payload.findByID({
          collection: collectionConfig.slug,
          depth: 1,
          ...(usePublishedDocForPath
            ? {
              draft: false,
            }
            : {}),
          id: pageId,
          locale: 'all',
        });

        if (pageDoc) {
          const breadcrumb = await buildBreadcrumbsForDoc({
            doc: pageDoc as unknown as Record<string, unknown>,
            payload,
            usePublishedParents: usePublishedDocForPath,
          });

          return generatePageUrl({
            alternateLocaleForMissingPath,
            breadcrumb,
            locale,
            omitMissingPath,
            pageDoc,
          });
        }

        return null;
      } catch {
        return null;
      }
    }));

    // find the first successful result
    for (const result of regularResults) {
      if (result.status === 'fulfilled' && result.value) {
        return finish(result.value);
      }
    }

    // try singleton pages
    const singletonCollections = singletonSlugs
      .filter((slug) => slug.linkable)
      .map((slug) => slug.slug);
    const singletonResults = await Promise.allSettled(singletonCollections.map(async (collectionSlug) => {
      try {
        const pageDoc = await payload.findByID({
          collection: collectionSlug,
          depth: 1,
          ...(usePublishedDocForPath
            ? {
              draft: false,
            }
            : {}),
          id: pageId,
          locale: 'all',
        });

        if (pageDoc) {
          const breadcrumb = await buildBreadcrumbsForDoc({
            doc: pageDoc as unknown as Record<string, unknown>,
            payload,
            usePublishedParents: usePublishedDocForPath,
          });
          const url = urlForSingletonPage({
            alternateLocaleForMissingPath,
            breadcrumb,
            locale,
            pageDoc,
          });

          if (url) {
            return url;
          }

          if (omitMissingPath) {
            return HREF_LANG_NO_EXACT_PATH;
          }

          return getTenantHomeUrl({
            locale,
            tenantSlug: getTenantSlugFromPageDoc(pageDoc as unknown as Record<string, unknown>),
          });
        }

        return null;
      } catch {
        return null;
      }
    }));

    // find the first successful result
    for (const result of singletonResults) {
      if (result.status === 'fulfilled' && result.value) {
        return finish(result.value);
      }
    }

    // Fallback: no pageDoc found anywhere — sagw home as last resort.
    pathname = omitMissingPath
      ? HREF_LANG_NO_EXACT_PATH
      : (getRootPathUrls()[locale] || '/de');
  } catch (error) {
    console.error('Error getting page URL:', error);

    pathname = omitMissingPath
      ? HREF_LANG_NO_EXACT_PATH
      : (getRootPathUrls()[locale] || '/de');
  }

  return finish(pathname);
};
