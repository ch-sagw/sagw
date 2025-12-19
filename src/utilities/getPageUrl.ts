import type { BasePayload } from 'payload';
import type { Config } from '@/payload-types';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';

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

    return getRootPathUrls()[locale] || '/de';
  } catch (error) {
    console.error('Error getting page URL:', error);

    return getRootPathUrls()[locale] || '/de';
  }
};
