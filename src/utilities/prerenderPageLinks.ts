import type { BasePayload } from 'payload';
import type { Config } from '@/payload-types';
import { getPageUrl } from '@/utilities/getPageUrl';

interface InterfacePrerenderPageLinksParams {
  pages: { id: string }[];
  locale: Config['locale'];
  payload: BasePayload;
}

// Pre-generates URLs for all pages and returns a serializable Record
// mapping page IDs to URLs
export const prerenderPageLinks = async ({
  pages,
  locale,
  payload,
}: InterfacePrerenderPageLinksParams): Promise<Record<string, string>> => {

  const pageUrls = await Promise.all(pages.map(async (page) => ({
    pageId: page.id,

    // TODO: we need reference tracking here
    url: await getPageUrl({
      locale,
      pageId: page.id,
      payload,
    }),
  })));

  // Create a plain object for serialization
  const urlMap = Object.fromEntries(pageUrls.map(({
    pageId, url,
  }) => {
    const urlsObject = [
      pageId,
      url,
    ];

    return urlsObject;
  }));

  return urlMap;
};

