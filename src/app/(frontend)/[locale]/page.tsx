import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { RenderPage } from '@/app/(frontend)/renderers/RenderPage';
import { getTenantFromUrl } from '@/app/(frontend)/utilities/getTenantFromUrl';
import { CMSConfigError } from '../utilities/CMSConfigError';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  fetchHomePageData, HomePageRouteProps,
} from '@/app/(frontend)/fetchers/home';
import { renderMeta } from '@/app/(frontend)/renderers/RenderMeta';
import { draftMode } from 'next/headers';

export const dynamic = 'force-static';

export const generateStaticParams = (): { locale: TypedLocale }[] => {
  const locales = getLocaleCodes();

  return locales.map((locale) => ({
    locale,
  }));
};

export const generateMetadata = async ({
  params,
}: HomePageRouteProps): Promise<Metadata> => {
  const meta = await renderMeta({
    isHome: true,
    params,
  });

  return meta;
};

export default async function HomePage({
  params,
}: HomePageRouteProps): Promise<React.JSX.Element> {
  const {
    locale,
  } = await params;

  const {
    isEnabled: isDraftMode,
  } = await draftMode();

  const tenantInfo = await getTenantFromUrl(undefined);

  if (!tenantInfo.tenantId) {
    return <CMSConfigError message='No tenant data.' />;
  }

  const homePageData = await fetchHomePageData({
    isDraftMode,
    locale,
    tenantId: tenantInfo.tenantId,
  });

  if (!homePageData) {
    notFound();
  }

  return (
    <RenderPage
      isHome={true}
      locale={locale}
      tenantId={tenantInfo.tenantId}
      preFetchedData={homePageData}
    />
  );
}
