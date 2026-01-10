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
import { getLocaleCodes } from '@/i18n/payloadConfig';

interface InterfaceGetPageUrlParams {
  payload: BasePayload;
  pageId: string;
  locale: Config['locale'];
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

  // extract tenant slug string
  let tenantSlug: string | null = null;

  if (tenant && typeof tenant === 'object' && tenant.slug) {
    if ((typeof tenant.slug === 'object') && (locale in tenant.slug)) {
      tenantSlug = tenant.slug[locale];
    } else if (typeof tenant.slug === 'string') {

      tenantSlug = tenant.slug;
    }

    tenantSlug = tenantSlug || null;
  }

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
    const tenantSlugs: Partial<Record<Config['locale'], string | null>> = {};
    const {
      tenant,
    } = pageDocRecord;

    // tenant slug - with fallback to german
    if (tenant && typeof tenant === 'object' && 'slug' in tenant) {
      const tenantSlug = tenant.slug;
      const locales = getLocaleCodes();
      const localizedSlug = tenantSlug as Partial<Record<Config['locale'], string>>;
      const germanSlug = localizedSlug.de || null;

      locales.forEach((loc) => {
        tenantSlugs[loc] = localizedSlug[loc] || germanSlug;
      });
    }

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
      tenant: tenantSlugs[locale] ?? tenantSlugs.de ?? null,
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
}: InterfaceGetPageUrlParams): Promise<string> => {
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
        return result.value;
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
        return result.value;
      }
    }

    // Fallback
    return getRootPathUrls()[locale] || '/de';
  } catch (error) {
    console.error('Error getting page URL:', error);

    return getRootPathUrls()[locale] || '/de';
  }
};
