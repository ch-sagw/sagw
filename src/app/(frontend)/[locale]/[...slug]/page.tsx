import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { RenderPage } from '@/app/(frontend)/renderers/RenderPage';
import { InterfaceOtherPagesProps } from '@/app/(frontend)/fetchers/otherPages';
import { Metadata } from 'next';
import { renderMeta } from '@/app/(frontend)/renderers/RenderMeta';
import { getPageData } from '../../fetchers/pageData';
import { runRedirectIfMatch } from '@/components/helpers/redirects';
import { RenderNotFoundPage } from '@/app/(frontend)/renderers/RenderNotFoundPage';

// Intentionally empty: we no longer pre-render the pages at build time
// since it's too time-consuming and expensive. static pages are killed
// anyway after a single change in payload.
export const generateStaticParams = (): { locale: TypedLocale; slug: string[] }[] => [];

// export const revalidate = 1;
// export const dynamic = 'force-dynamic';

export const dynamic = 'force-static';

export const generateMetadata = async ({
  params,
}: InterfaceOtherPagesProps): Promise<Metadata> => {
  const meta = await renderMeta({
    isHome: false,
    params,
  });

  return meta;
};

export default async function Page({
  params,
}: InterfaceOtherPagesProps): Promise<React.JSX.Element> {
  const {
    locale,
    slug,
  } = await params;

  const pageData = await getPageData({
    locale,
    slug,
  });

  if (!pageData) {
    await runRedirectIfMatch({
      locale,
      url: slug.join('/'),
    });

    return (
      <RenderNotFoundPage
        locale={locale}
        slugSegments={slug}
      />
    );
  }

  return (
    <RenderPage
      isHome={pageData.isHome}
      locale={locale}
      tenantId={pageData.tenantInfo.tenantId}
      preFetchedData={pageData.pageData}
      pageSlugs={slug}
    />
  );
}
