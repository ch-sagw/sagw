/* eslint-disable prefer-destructuring */

import 'server-only';
import { getTenantFromUrl } from '../utilities/getTenantFromUrl';
import { getTenantName } from '../utilities/getTenantName';
import { Metadata } from 'next';
import {
  fetchHomePageData, InterfaceHomePageProps,
} from '@/app/(frontend)/fetchers/home';
import { Image } from '@/payload-types';
import { InterfaceOtherPagesProps } from '@/app/(frontend)/fetchers/otherPages';
import { getPageData } from '../fetchers/pageData';
import { getServerSideURL } from '@/utilities/getUrl';

export const renderMeta = async ({
  params,
  isHome,
}: InterfaceHomePageProps | InterfaceOtherPagesProps): Promise<Metadata> => {
  let pageData;
  let tenantInfo;
  let locale;

  if (isHome) {
    // -------------------
    // SAGW HOME
    // -------------------

    locale = (await params).locale;
    tenantInfo = await getTenantFromUrl(undefined, locale);

    if (!tenantInfo.tenantId) {
      return {
        title: 'Error',
      };
    }

    const homePageData = await fetchHomePageData({
      locale,
      tenantId: tenantInfo.tenantId,
    });

    if (!homePageData) {
      return {
        title: 'Error',
      };
    }

    pageData = homePageData.pageData;

  } else {

    // -------------------
    // OTHER PAGES
    // -------------------

    const awaitedParams = await params;

    locale = awaitedParams.locale;

    const slug = 'slug' in awaitedParams
      ? awaitedParams.slug
      : [];

    const pageDataRaw = await getPageData({
      locale,
      slug,
    });

    if (!pageDataRaw) {
      return {
        title: 'Error',
      };
    }

    pageData = pageDataRaw.pageData.pageData;
    tenantInfo = pageDataRaw.tenantInfo;
  }

  if (!pageData || !pageData?.meta) {
    return {
      title: 'Error',
    };
  }

  const meta = pageData.meta.seo;
  let seoImage;
  let seoIndex = false;

  if (meta.image) {
    seoImage = meta.image as Image;
  }

  if (meta.index && process.env.ENV === 'prod') {
    seoIndex = meta.index;
  }

  // remove before go-live: https://github.com/ch-sagw/sagw/issues/782
  seoIndex = false;

  const tenantName = await getTenantName({
    id: tenantInfo.tenantId,
  });

  const serverBase = getServerSideURL()
    .replace(/\/+$/u, '');
  const tenantMetadataRoot = tenantInfo.isSagw || !tenantInfo.tenantSlug
    ? `${serverBase}/`
    : `${serverBase}/${tenantInfo.tenantSlug}/`;
  const metadataRootUrl = new URL(tenantMetadataRoot);

  return {
    description: meta.description,
    icons: {
      apple: [
        {
          sizes: '180x180',
          url: `/favicons/${tenantName.name}/apple-touch-icon.png`,
        },
      ],
      icon: [
        {
          sizes: '32x32',
          url: `/favicons/${tenantName.name}/favicon.ico`,
        },
        {
          type: 'image/svg+xml',
          url: `/favicons/${tenantName.name}/favicon.svg`,
        },
      ],
    },
    keywords: meta?.keywords?.map((k: any) => k.keyword)
      .filter((k: any): k is string => Boolean(k)),
    metadataBase: metadataRootUrl,
    openGraph: {
      description: meta.description,
      images: seoImage?.url
        ? [
          {
            height: 600,
            url: seoImage.url,
            width: 800,
          },
        ]
        : undefined,
      locale: `${locale}_${locale.toUpperCase()}`,
      title: meta.title,
      type: 'website',
      url: metadataRootUrl,
    },
    robots: {
      follow: seoIndex,
      googleBot: {
        follow: seoIndex,
        index: seoIndex,
        noimageindex: !seoIndex,
      },
      index: seoIndex,
      nocache: false,
    },
    title: meta.title,
  };
};
