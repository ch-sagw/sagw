import type { BasePayload } from 'payload';
import type {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';
import { singletonSlugs } from '@/collections/Pages/pages';
import { urlFromBreadcrumb } from '@/hooks-payload/computeLinkUrls/urlFromBreadcrumb';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';

interface InterfaceGetPageUrlParams {
  payload: BasePayload;
  pageId: string;
  locale: Config['locale'];
}

// gets url for a page by querying Links collection
// (url computed on-read via afterRead hook)
export const getPageUrl = async ({
  payload,
  pageId,
  locale,
}: InterfaceGetPageUrlParams): Promise<string> => {
  try {
    const linkDoc = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        documentId: {
          equals: pageId,
        },
      },
    });

    // 1. get url for regular pages
    if (linkDoc.docs.length > 0) {

      // URL computed by afterRead hook
      const urlObj = (linkDoc.docs[0] as any).url;

      if (urlObj && typeof urlObj === 'object') {
        const url = urlObj[locale];

        if (url && typeof url === 'string') {
          return url;
        }
      }
    }

    // 2. Check linkable singleton pages
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

        return pageDoc;
      } catch {
        return null;
      }
    }));

    // Find the first successful result
    for (const result of singletonResults) {
      if (result.status === 'fulfilled' && result.value) {
        const pageDoc = result.value;
        const pageDocRecord = pageDoc as unknown as Record<string, unknown>;
        const breadcrumb = (pageDocRecord[fieldBreadcrumbFieldName] ?? []) as InterfaceBreadcrumb;
        const tenant = pageDocRecord.tenant as { slug?: Record<string, string> } | undefined;

        // Handle slug
        let slugRecord: Record<string, string>;

        if (typeof pageDocRecord.slug === 'string') {
          // Convert string slug to Record format
          slugRecord = {
            [locale]: pageDocRecord.slug,
          };
        } else {
          slugRecord = pageDocRecord.slug as Record<string, string>;
        }

        // Extract tenant slug string
        let tenantSlug: string | null = null;

        if (tenant && typeof tenant === 'object' && tenant.slug) {
          const tenantSlugObj = tenant.slug as Record<string, string>;

          tenantSlug = tenantSlugObj[locale] || tenantSlugObj.de || null;
        }

        // Use generatePageUrl to build the URL
        const url = urlFromBreadcrumb({
          locale,
          page: {
            breadcrumb,
            slug: slugRecord,
          },
          tenant: tenantSlug,
        });

        if (url) {
          return url;
        }
      }
    }

    // 3. fallback
    return getRootPathUrls()[locale] || '/de';
  } catch (error) {
    console.error('Error getting page URL:', error);

    return getRootPathUrls()[locale] || '/de';
  }
};
