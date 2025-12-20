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
import { urlFromBreadcrumb } from '@/hooks-payload/computeLinkUrls/urlFromBreadcrumb';

type LocalizedString = Partial<Record<Config['locale'], string>>;

interface InterfaceComputeUrlsForLinkParams {
  payload: BasePayload;
  collectionSlug: CollectionSlug;
  documentId: string;
}

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

      const url = await urlFromBreadcrumb({
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
