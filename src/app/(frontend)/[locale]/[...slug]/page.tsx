import 'server-only';
import React from 'react';
import { RenderPage } from '@/app/(frontend)/renderers/RenderPage';
import { generateStaticParams } from '@/app/(frontend)/utilities/generateStaticParams';
import { InterfaceOtherPagesProps } from '@/app/(frontend)/fetchers/otherPages';
import { Metadata } from 'next';
import { renderMeta } from '@/app/(frontend)/renderers/RenderMeta';
import { RenderNotFoundPage } from '@/app/(frontend)/renderers/RenderNotFoundPage';
import { getPageData } from '../../fetchers/pageData';

export { generateStaticParams };

export const revalidate = 1;
export const dynamic = 'force-dynamic';

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
