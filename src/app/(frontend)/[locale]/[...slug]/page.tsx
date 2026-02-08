import 'server-only';
import React from 'react';
import {
  CollectionSlug, TypedLocale,
} from 'payload';
import { RenderPage } from '@/app/(frontend)/renderers/RenderPage';
import { getTenantFromUrl } from '@/app/(frontend)/utilities/getTenantFromUrl';
import { CMSConfigError } from '../../utilities/CMSConfigError';
import { generateStaticParams } from '@/app/(frontend)/utilities/generateStaticParams';
import { findPageByPath } from '@/app/(frontend)/utilities/findPageByPath';
import { notFound } from 'next/navigation';

type InterfacePageProps = {
  params: Promise<{
    locale: TypedLocale;
    slug: string[];
  }>;
}

const fetchDetailPageData = async ({
  locale,
  slugSegments,
  tenantId,
}: {
  locale: TypedLocale;
  slugSegments: string[];
  tenantId: string;
}): Promise<{
  foundCollection: CollectionSlug;
  pageData: any;
} | null> => {
  const pageResult = await findPageByPath({
    locale,
    slugSegments,
    tenantId,
  });

  if (!pageResult) {
    return null;
  }

  return {
    foundCollection: pageResult.foundCollection as CollectionSlug,
    pageData: pageResult.pageData,
  };
};

export { generateStaticParams };

export default async function Page({
  params,
}: InterfacePageProps): Promise<React.JSX.Element> {
  const {
    locale,
    slug,
  } = await params;

  // handle empty slug array (shouldn't happen, just for security)
  if (slug.length === 0) {
    // this is actually the home page, but it should be handled
    // by [locale]/page.tsx
    // if we reach here, treat as SAGW home
    const tenantInfo = await getTenantFromUrl(undefined, locale);

    if (!tenantInfo.tenantId) {
      return <CMSConfigError message='There are no configured tenants.' />;
    }

    return (
      <RenderPage
        isHome={true}
        locale={locale}
        tenantId={tenantInfo.tenantId}
      />
    );
  }

  // check if first segment is a tenant
  const [firstSegment] = slug;
  const tenantInfo = await getTenantFromUrl(firstSegment, locale);

  // if first segment is a tenant (non-SAGW)
  if (!tenantInfo.isSagw && tenantInfo.tenantId) {
    // non-SAGW route
    if (slug.length === 1) {
      // non-SAGW home: /de/tenant-slug
      return (
        <RenderPage
          isHome={true}
          locale={locale}
          tenantId={tenantInfo.tenantId}
        />
      );
    }

    // non-SAGW page: /de/tenant-slug/page-slug1/page-slug2
    // remove tenant segment, rest are page slugs
    const pageSlugs = slug.slice(1);

    // Fetch page data
    const detailPageData = await fetchDetailPageData({
      locale,
      slugSegments: pageSlugs,
      tenantId: tenantInfo.tenantId,
    });

    if (!detailPageData) {
      notFound();
    }

    return (
      <RenderPage
        isHome={false}
        locale={locale}
        tenantId={tenantInfo.tenantId}
        pageSlugs={pageSlugs}
        preFetchedData={detailPageData}
      />
    );
  }

  // SAGW route: /de/page-slug1/page-slug2
  // all segments are page slugs
  const sagwTenantInfo = await getTenantFromUrl(undefined, locale);

  if (!sagwTenantInfo.tenantId) {
    return <CMSConfigError message='There are no configured tenants.' />;
  }

  // Fetch page data
  const detailPageData = await fetchDetailPageData({
    locale,
    slugSegments: slug,
    tenantId: sagwTenantInfo.tenantId,
  });

  if (!detailPageData) {
    notFound();
  }

  return (
    <RenderPage
      isHome={false}
      locale={locale}
      tenantId={sagwTenantInfo.tenantId}
      pageSlugs={slug}
      preFetchedData={detailPageData}
    />
  );
}
