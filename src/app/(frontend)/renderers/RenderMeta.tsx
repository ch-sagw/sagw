/* eslint-disable prefer-destructuring */

import 'server-only';
import { getTenantFromUrl } from '@/app/(frontend)/utilities/getTenantFromUrl';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import {
  fetchHomePageData, InterfaceHomePageProps,
} from '@/app/(frontend)/fetchers/home';
import {
  Image, Tenant,
} from '@/payload-types';
import { InterfaceOtherPagesProps } from '@/app/(frontend)/fetchers/otherPages';
import { getPageData } from '@/app/(frontend)/fetchers/pageData';
import { getServerSideURL } from '@/utilities/getUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  getPageUrl, HREF_LANG_NO_EXACT_PATH,
} from '@/utilities/getPageUrl';
import {
  getTenantById, getTenantHomeUrl,
} from '@/utilities/tenant';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import type { TypedLocale } from 'payload';

// hreflang value(s) per locale; German gets x-default and explicit de-CH
const HREFLANG_CODES: Record<TypedLocale, string[]> = {
  de: [
    'x-default',
    'de-CH',
  ],
  en: ['en-GB'],
  fr: ['fr-CH'],
  it: ['it-CH'],
};

const getEnabledLocalesForTenant = (languages: Tenant['languages'] | null | undefined): TypedLocale[] => {
  const locales = getLocaleCodes();

  if (!languages) {
    return locales;
  }

  return locales.filter((locale) => languages[locale as keyof typeof languages]);
};

const buildPageAlternates = async ({
  currentLocale,
  isHome,
  pageId,
  serverBase,
  tenantDoc,
}: {
  currentLocale: TypedLocale;
  isHome: boolean;
  pageId?: string;
  serverBase: string;
  tenantDoc: Tenant | null | undefined;
}): Promise<{
  canonical?: string;
  languages: Record<string, string>;
}> => {
  const payload = await getPayloadCached();

  const enabledLocales = getEnabledLocalesForTenant(tenantDoc?.languages);
  const tenantSlug = tenantDoc?.slug;

  const resolvedPaths = await Promise.all(enabledLocales.map(async (altLocale) => {
    if (isHome) {
      return {
        locale: altLocale,
        pathname: getTenantHomeUrl({
          locale: altLocale,
          tenantSlug,
        }),
      };
    }

    if (!pageId) {
      return {
        locale: altLocale,
        pathname: undefined,
      };
    }

    try {
      const raw = await getPageUrl({
        absolute: false,
        locale: altLocale,
        omitMissingPath: true,
        pageId,
        payload,
      });
      const pathname = raw === HREF_LANG_NO_EXACT_PATH
        ? undefined
        : raw;

      return {
        locale: altLocale,
        pathname,
      };
    } catch {
      return {
        locale: altLocale,
        pathname: undefined,
      };
    }
  }));

  const languages: Record<string, string> = {};
  let canonical: string | undefined;

  resolvedPaths.forEach(({
    locale: altLocale, pathname,
  }) => {
    if (!pathname) {
      return;
    }

    const absoluteUrl = new URL(pathname, `${serverBase}/`).href;

    for (const code of HREFLANG_CODES[altLocale]) {
      languages[code] = absoluteUrl;
    }

    if (altLocale === currentLocale) {
      canonical = absoluteUrl;
    }
  });

  return {
    canonical,
    languages,
  };
};

export const renderMeta = async ({
  params,
  isHome,
}: InterfaceHomePageProps | InterfaceOtherPagesProps): Promise<Metadata> => {
  const {
    isEnabled: isDraftMode,
  } = await draftMode();

  let pageData;
  let tenantInfo;
  let locale;

  if (isHome) {
    // -------------------
    // SAGW HOME
    // -------------------

    locale = (await params).locale;
    tenantInfo = await getTenantFromUrl(undefined);

    if (!tenantInfo.tenantId) {
      return {
        title: 'Error',
      };
    }

    const homePageData = await fetchHomePageData({
      isDraftMode,
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
      isDraftMode,
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

  seoIndex = false;

  if (meta.index && process.env.ENV === 'prod') {
    seoIndex = meta.index;
  }

  const tenantName = await getTenantById({
    id: tenantInfo.tenantId,
  });

  const serverBase = getServerSideURL()
    .replace(/\/+$/u, '');
  const tenantMetadataRoot = tenantInfo.isSagw || !tenantInfo.tenantSlug
    ? `${serverBase}/`
    : `${serverBase}/${tenantInfo.tenantSlug}/`;
  const metadataRootUrl = new URL(tenantMetadataRoot);

  const {
    canonical, languages: alternateLanguages,
  } = await buildPageAlternates({
    currentLocale: locale as TypedLocale,
    isHome: Boolean(isHome),
    pageId: pageData.id,
    serverBase,
    tenantDoc: tenantName as Tenant | null,
  });

  return {
    alternates: {
      canonical,
      languages: alternateLanguages,
    },
    description: meta.description,
    icons: {
      apple: [
        {
          sizes: '180x180',
          url: `/favicons/${tenantName.slug}/apple-touch-icon.png`,
        },
      ],
      icon: [
        {
          sizes: '32x32',
          url: `/favicons/${tenantName.slug}/favicon.ico`,
        },
        {
          type: 'image/svg+xml',
          url: `/favicons/${tenantName.slug}/favicon.svg`,
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
      url: canonical ?? metadataRootUrl.href,
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
