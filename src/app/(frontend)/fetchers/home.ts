import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { InterfacePreFetchedHomePageData } from '@/app/(frontend)/renderers/RenderPage';
import { getPageUrl } from '@/utilities/getPageUrl';

/** Props Next passes into `[locale]/page` — no app-only fields. */
export type HomePageRouteProps = {
  params: Promise<{
    locale: TypedLocale;
  }>;
};

export type InterfaceHomePageProps = HomePageRouteProps & {
  isHome: boolean;
};

export const fetchHomePageData = async ({
  isDraftMode,
  locale,
  tenantId,
}: {
  isDraftMode?: boolean;
  locale: TypedLocale;
  tenantId: string;
}): Promise<InterfacePreFetchedHomePageData | null> => {
  const payload = await getPayloadCached();

  const pagesData = await payload.find({
    collection: 'homePage',

    // necessary to get image url in meta
    depth: 2,
    draft: isDraftMode,
    limit: 1,
    locale,
    where: {
      and: [
        {
          tenant: {
            equals: tenantId,
          },
        },
        ...(isDraftMode
          ? []
          : [
            {
              /* eslint-disable @typescript-eslint/naming-convention */
              _status: {
                equals: 'published',
              },
              /* eslint-enable @typescript-eslint/naming-convention */
            },
          ]),
      ],
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
