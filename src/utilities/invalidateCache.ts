import type {
  BasePayload, TypedLocale,
} from 'payload';
import { getPageUrl } from './getPageUrl';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';
import { revalidatePath } from 'next/cache.js';

interface InterfaceInvalidateCacheParams {
  pageId: string;
  locale: TypedLocale;
  payload: BasePayload;
  collectionSlug?: string;
}

// invalidates cache for a page by revalidating its URL path
export const invalidateCache = async ({
  pageId,
  locale,
  payload,
  collectionSlug,
}: InterfaceInvalidateCacheParams): Promise<void> => {
  try {
    // Get page URL using updated getPageUrl (no Links collection dependency)
    const url = await getPageUrl({
      locale,
      pageId,
      payload,
    });

    // skip invalidation if URL is just the root path for this locale
    // this can happen when the page doesn't have a slug in this locale
    // (home is exception)
    const rootPathUrls = getRootPathUrls();
    const rootPathForLocale = rootPathUrls[locale] || `/${locale}`;

    if (url === rootPathForLocale && collectionSlug !== 'homePage') {
      return;
    }

    // IMPORTANT: do not change this log. This is neccessary for testing!!
    if (process.env.ENV !== 'prod') {
      console.log('[CACHE] invalidating path:', url);
    }

    // Invalidate cache for this URL
    if (process.env.ENV === 'prod') {
      revalidatePath(url);
    }

    // Optionally invalidate for all locales if needed
    // const locales = getLocaleCodes();
    // await Promise.all(locales.map(loc => {
    //   const url = await getPageUrl({ payload, pageId, locale: loc });
    //   revalidatePath(url);
    // }));
  } catch (error) {
    console.error(`Error invalidating cache for page ${pageId}:`, error);
  }
};

