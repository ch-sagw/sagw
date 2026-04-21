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

export interface InterfaceGetPageUrlParams {
  payload: BasePayload;
  pageId: string;
  locale: Config['locale'];
  absolute?: boolean;
}

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
  breadcrumb,
  locale,
  pageDoc,
}: {
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

  return urlFromBreadcrumb({
    locale,
    page: {
      breadcrumb,
      slug: slugRecord,
    },
    tenant: getTenantSlugFromPageDoc(pageDocRecord) || '',
  });
};

const generatePageUrl = async ({
  breadcrumb,
  locale,
  pageDoc,
}: {
  breadcrumb: InterfaceBreadcrumb;
  locale: Config['locale'];
  pageDoc?: unknown;
}): Promise<string> => {
  try {
    if (!pageDoc) {
      return getRootPathUrls()[locale] || `/${locale}`;
    }

    const pageDocRecord = pageDoc as unknown as Record<string, unknown>;

    // if no translation exists for the target locale, fall back to the
    // tenant's home in that locale
    const tenantHomeFallback = getTenantHomeUrl({
      locale,
      tenantSlug: getTenantSlugFromPageDoc(pageDocRecord),
    });

    const slugRecord = slugRecordFromPageDoc({
      locale,
      pageDocRecord,
    });

    if (!slugRecord) {
      return tenantHomeFallback;
    }

    const url = await urlFromBreadcrumb({
      locale,
      page: {
        breadcrumb,
        slug: slugRecord,
      },
      tenant: getTenantSlugFromPageDoc(pageDocRecord) || null,
    });

    if (url === undefined) {
      return tenantHomeFallback;
    }

    return url;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status !== 404) {
      console.error('Error generating page URL:', error);
    }

    return getRootPathUrls()[locale] || `/${locale}`;
  }
};

// gets URL for a page by fetching the page document and generating URL
export const getPageUrl = async ({
  payload,
  pageId,
  locale,
  absolute = true,
}: InterfaceGetPageUrlParams): Promise<string> => {
  let pathname: string;

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
          id: pageId,
          locale: 'all',
        });

        if (pageDoc) {
          const breadcrumb = await buildBreadcrumbsForDoc({
            doc: pageDoc as unknown as Record<string, unknown>,
            payload,
          });

          return await generatePageUrl({
            breadcrumb,
            locale,
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
        pathname = result.value;

        return absolute
          ? absoluteUrlFromPathname(pathname)
          : pathname;
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
          id: pageId,
          locale,
        });

        if (pageDoc) {
          const breadcrumb = await buildBreadcrumbsForDoc({
            doc: pageDoc as unknown as Record<string, unknown>,
            payload,
          });
          const url = urlForSingletonPage({
            breadcrumb,
            locale,
            pageDoc,
          });

          // return built URL, else tenant-home fallback for this pageDoc.
          if (url) {
            return url;
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
        pathname = result.value;

        return absolute
          ? absoluteUrlFromPathname(pathname)
          : pathname;
      }
    }

    // Fallback: no pageDoc found anywhere — sagw home as last resort.
    pathname = getRootPathUrls()[locale] || '/de';
  } catch (error) {
    console.error('Error getting page URL:', error);

    pathname = getRootPathUrls()[locale] || '/de';
  }

  return absolute
    ? absoluteUrlFromPathname(pathname)
    : pathname;
};
