import type { BasePayload } from 'payload';
import type {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';
import {
  globalCollectionsSlugs, setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { urlFromBreadcrumb } from '@/utilities/urlFromBreadcrumb';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import { absoluteUrlFromPathname } from '@/utilities/getUrl';
import { getTenantSlugForLocale } from '@/utilities/tenant';

export interface InterfaceGetPageUrlParams {
  payload: BasePayload;
  pageId: string;
  locale: Config['locale'];
  absolute?: boolean;
}

const urlForSingletonPage = ({
  locale,
  pageDoc,
}: {
  locale: Config['locale'];
  pageDoc: any;
}): string | undefined => {
  const pageDocRecord = pageDoc as unknown as Record<string, unknown>;
  const breadcrumb = (pageDocRecord[fieldBreadcrumbFieldName] ?? []) as InterfaceBreadcrumb;
  const tenant = pageDocRecord.tenant as { slug?: Record<string, string> } | { slug?: string } | undefined;
  let slugRecord: Record<string, string>;
  const slugValue = pageDocRecord.slug;

  if (!slugValue) {
    return undefined;
  }

  if (typeof slugValue === 'string') {
    // single locale slug, convert to record
    slugRecord = {
      [locale]: slugValue,
    };
  } else if (typeof slugValue === 'object' && slugValue !== null) {
    slugRecord = slugValue as Record<string, string>;
  } else {
    return undefined;
  }

  const tenantSlug = getTenantSlugForLocale({
    locale,
    slug: tenant?.slug,
  });

  // build the URL
  const url = urlFromBreadcrumb({
    locale,
    page: {
      breadcrumb,
      slug: slugRecord,
    },
    tenant: tenantSlug,
  });

  return url;
};

const generatePageUrl = async ({
  locale,
  pageDoc,
}: {
  locale: Config['locale'];
  pageDoc?: unknown;
}): Promise<string> => {
  try {
    if (!pageDoc) {
      return getRootPathUrls()[locale] || `/${locale}`;
    }

    const pageDocRecord = pageDoc as unknown as Record<string, unknown>;
    const {
      tenant,
    } = pageDocRecord;

    // gandle slug - normalize to Record<string, string>
    let slugRecord: Record<string, string>;
    const slugValue = pageDocRecord.slug;

    if (!slugValue) {
      return getRootPathUrls()[locale] || `/${locale}`;
    }

    if (typeof slugValue === 'string') {
      slugRecord = {
        [locale]: slugValue,
      };
    } else if (typeof slugValue === 'object' && slugValue !== null) {
      slugRecord = slugValue as Record<string, string>;
    } else {
      return getRootPathUrls()[locale] || `/${locale}`;
    }

    const url = await urlFromBreadcrumb({
      locale,
      page: {
        breadcrumb: (pageDocRecord[fieldBreadcrumbFieldName] ?? []) as InterfaceBreadcrumb,
        slug: slugRecord,
      },
      tenant: getTenantSlugForLocale({
        locale,
        slug: (tenant && typeof tenant === 'object' && 'slug' in tenant)
          ? tenant.slug as string | Partial<Record<Config['locale'], string>>
          : undefined,
      }),
    });

    if (url === undefined) {
      return getRootPathUrls()[locale] || `/${locale}`;
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
          return await generatePageUrl({
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
          const url = urlForSingletonPage({
            locale,
            pageDoc,
          });

          return url || null;
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

    // Fallback
    pathname = getRootPathUrls()[locale] || '/de';
  } catch (error) {
    console.error('Error getting page URL:', error);

    pathname = getRootPathUrls()[locale] || '/de';
  }

  return absolute
    ? absoluteUrlFromPathname(pathname)
    : pathname;
};
