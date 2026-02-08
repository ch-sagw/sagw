import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { RenderPage } from '@/app/(frontend)/renderers/RenderPage';
import { getTenantFromUrl } from '@/app/(frontend)/utilities/getTenantFromUrl';
import { CMSConfigError } from '../utilities/CMSConfigError';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { Metadata } from 'next';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getPageUrl } from '@/utilities/getPageUrl';
import { notFound } from 'next/navigation';
import type { HomePage as InterfaceHomePage } from '@/payload-types';

type InterfacePageProps = {
  params: Promise<{
    locale: TypedLocale
  }>
}

const fetchHomePageData = async ({
  locale,
  tenantId,
}: {
  locale: TypedLocale;
  tenantId: string;
}): Promise<InterfaceHomePage | null> => {
  const payload = await getPayloadCached();

  const pagesData = await payload.find({
    collection: 'homePage',
    depth: 1,
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

  return pagesData.docs[0];
};

export const generateStaticParams = (): { locale: TypedLocale }[] => {
  const locales = getLocaleCodes();

  return locales.map((locale) => ({
    locale,
  }));
};

export const generateMetadata = async ({
  params,
}: InterfacePageProps): Promise<Metadata> => {
  const {
    locale,
  } = await params;

  const tenantInfo = await getTenantFromUrl(undefined, locale);

  if (!tenantInfo.tenantId) {
    return {
      title: 'Error',
    };
  }

  const pageData = await fetchHomePageData({
    locale,
    tenantId: tenantInfo.tenantId,
  });

  if (!pageData) {
    return {
      title: 'Error',
    };
  }

  // Use page metadata if available
  const meta = pageData.meta?.seo;

  return {
    description: meta?.description || 'BOO FAR DESCRIOTION',
    icons: {
      apple: '/apple-icon.png',
      icon: '/icon.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
      shortcut: '/shortcut-icon.png',
    },
    // keywords: meta?.keywords?.map((k) => k.keyword)
    //   .filter((k): k is string => Boolean(k)) || [
    //     'key1',
    //     'key2',
    //   ],
    openGraph: {
      description: meta?.description || 'BOO FAR DESCRIOTION',
      images: meta?.image
        ? [
          {
            height: 600,
            url: typeof meta.image === 'string'
              ? meta.image
              : meta.image.url || '',
            width: 800,
          },
        ]
        : [
          {
            height: 600,
            url: 'https://foo.bar/og.png',
            width: 800,
          },
        ],
      locale: 'de_DE',
      title: meta?.title || 'FOO BAR TITLE',
      type: 'website',
      url: 'https://foo.bar',
    },
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: meta?.index ?? true,
        noimageindex: false,
      },
      index: meta?.index ?? true,
      nocache: false,
    },
    title: meta?.title || 'FOO BAR TITLE',
  };
};

export default async function HomePage({
  params,
}: InterfacePageProps): Promise<React.JSX.Element> {
  const {
    locale,
  } = await params;

  const tenantInfo = await getTenantFromUrl(undefined, locale);

  if (!tenantInfo.tenantId) {
    return <CMSConfigError message='No tenant data.' />;
  }

  const pageData = await fetchHomePageData({
    locale,
    tenantId: tenantInfo.tenantId,
  });

  if (!pageData) {
    notFound();
  }

  // Compute URL for optionalLink if it exists
  let optionalLinkUrl: string | undefined;

  if (pageData.hero?.optionalLink?.includeLink && pageData.hero.optionalLink.link?.internalLink?.documentId) {
    const payload = await getPayloadCached();

    optionalLinkUrl = await getPageUrl({
      locale,
      pageId: pageData.hero.optionalLink.link.internalLink.documentId,
      payload,
    });
  }

  return (
    <RenderPage
      isHome={true}
      locale={locale}
      tenantId={tenantInfo.tenantId}
      preFetchedData={{
        optionalLinkUrl,
        pageData,
      }}
    />
  );
}
