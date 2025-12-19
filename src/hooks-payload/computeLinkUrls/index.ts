// Hook to compute URLs when Links document is read
// URLs are computed from actual page document, ensuring they're always current

import {
  BasePayload, type CollectionAfterReadHook, CollectionSlug,
} from 'payload';
import {
  Config, InterfaceBreadcrumb, Link,
} from '@/payload-types';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { getRootPathUrls } from '../shared/getRootPathUrls';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';

type LocalizedString = Partial<Record<Config['locale'], string>>;

interface InterfaceComputeUrlsForLinkParams {
  payload: BasePayload;
  collectionSlug: CollectionSlug;
  documentId: string;
}

interface InterfaceGeneratePageUrlParams {
  page: {
    slug: Record<string, string>;
    breadcrumb: InterfaceBreadcrumb;
  };
  tenant: string | null;
  locale: Config['locale'];
}

// generates a single url for a page given locale, tenant, breadcrumb
const generatePageUrl = ({
  page,
  tenant,
  locale,
}: InterfaceGeneratePageUrlParams): string | undefined => {
  try {
    const slug: string = page.slug[locale];

    if (!slug || typeof slug !== 'string') {
      return undefined;
    }

    // Build path from breadcrumb
    const {
      breadcrumb,
    } = page;
    let path = '';

    if (breadcrumb && Array.isArray(breadcrumb) && breadcrumb.length > 0) {
      const breadcrumbsToProcess = breadcrumb.slice(0);
      const [firstBreadcrumb] = breadcrumbsToProcess;
      let startIndex = 0;

      if (firstBreadcrumb && typeof firstBreadcrumb === 'object') {
        const localeSlugField = `slug${locale}` as keyof typeof firstBreadcrumb;
        const firstSlug = firstBreadcrumb[localeSlugField];

        // check if first breadcrumb is "home" for this locale
        if (firstSlug === 'home') {
          startIndex = 1;
        }
      }

      // build path from breadcrumb slugs
      const breadcrumbSlugs = breadcrumbsToProcess
        .slice(startIndex)
        .map((crumb) => {
          if (!crumb || typeof crumb !== 'object') {
            return null;
          }

          // get slug for current locale only
          const localeSlugField = `slug${locale}` as keyof typeof crumb;
          const crumbSlug = crumb[localeSlugField];

          return typeof crumbSlug === 'string' && crumbSlug
            ? crumbSlug
            : null;
        })
        .filter((s): s is string => Boolean(s));

      path = breadcrumbSlugs.join('/');
    }

    // build final URL
    // Format: /{locale}/{tenant?}/{path-to-page}
    // (tenant is only included if it's not 'sagw')
    const localePath = `/${locale}/`;
    const tenantPath = tenant && tenant !== 'sagw'
      ? `${tenant}/`
      : '';
    const pagePath = path
      ? `${path}/${slug}`
      : slug;

    return `${localePath}${tenantPath}${pagePath}`;
  } catch (error) {
    console.error('Error generating page URL:', error);

    return undefined;
  }
};

const computeUrlsForLink = async ({
  payload,
  collectionSlug,
  documentId,
}: InterfaceComputeUrlsForLinkParams): Promise<LocalizedString> => {
  try {
    const pageDoc = await payload.findByID({
      collection: collectionSlug,
      depth: 1,
      id: documentId,
      locale: 'all',
    });

    if (!pageDoc) {
      return getRootPathUrls();
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

      locales.forEach((locale) => {
        tenantSlugs[locale] = localizedSlug[locale] || germanSlug;
      });
    }

    const urls: LocalizedString = {};
    const locales = getLocaleCodes();
    const rootPathUrls = getRootPathUrls();

    await Promise.all(locales.map(async (locale) => {

      const url = await generatePageUrl({
        locale,
        page: {
          breadcrumb: (pageDocRecord[fieldBreadcrumbFieldName] ?? []) as InterfaceBreadcrumb,
          slug: pageDocRecord.slug as Record<string, string>,
        },
        tenant: tenantSlugs[locale] ?? tenantSlugs.de ?? null,
      });

      if (url === undefined) {
        urls[locale] = rootPathUrls[locale] || `/${locale}`;
      } else {
        urls[locale] = url;
      }
    }));

    return urls;
  } catch (error) {
    console.error('Error computing URLs for link:', error);

    return getRootPathUrls();
  }
};

export const hookComputeLinkUrls: CollectionAfterReadHook = async ({
  doc,
  req,
}) => {
  if (!doc || !req?.payload) {
    return doc;
  }

  const linkDoc = doc as Link;

  const urls = await computeUrlsForLink({
    collectionSlug: linkDoc.slug as CollectionSlug,
    documentId: linkDoc.documentId,
    payload: req.payload,
  });

  return {
    ...doc,
    url: urls,
  };
};
