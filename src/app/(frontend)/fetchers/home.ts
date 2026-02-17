import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { InterfacePreFetchedHomePageData } from '@/app/(frontend)/renderers/RenderPage';
import { getPageUrl } from '@/utilities/getPageUrl';

export type InterfaceHomePageProps = {
  params: Promise<{
    locale: TypedLocale
  }>
  isHome: boolean;
}

export const fetchHomePageData = async ({
  locale,
  tenantId,
}: {
  locale: TypedLocale;
  tenantId: string;
}): Promise<InterfacePreFetchedHomePageData | null> => {
  const payload = await getPayloadCached();

  const pagesData = await payload.find({
    collection: 'homePage',

    // necessary to get image url in meta
    depth: 2,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
  });

  if (!pagesData.docs || pagesData.docs.length < 1) {
    return null;
  }

  // Compute URL for optionalLink if it exists
  let optionalLinkUrl: string | undefined;

  const [pageData] = pagesData.docs;

  if (pageData.hero?.optionalLink?.includeLink && pageData.hero.optionalLink.link?.internalLink?.documentId) {
    optionalLinkUrl = await getPageUrl({
      locale,
      pageId: pageData.hero.optionalLink.link.internalLink.documentId,
      payload,
    });
  }

  return {
    optionalLinkUrl,
    pageData: pagesData.docs[0],
  };
};
