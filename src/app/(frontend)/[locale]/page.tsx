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
  fetchHomePageData, InterfaceHomePageProps,
} from '@/app/(frontend)/fetchers/home';
import { renderMeta } from '@/app/(frontend)/renderers/RenderMeta';

export const generateStaticParams = (): { locale: TypedLocale }[] => {
  const locales = getLocaleCodes();

  return locales.map((locale) => ({
    locale,
  }));
};

export const generateMetadata = async ({
  params,
}: InterfaceHomePageProps): Promise<Metadata> => {
  const meta = await renderMeta({
    isHome: true,
    params,
  });

  return meta;
};

export default async function HomePage({
  params,
}: InterfaceHomePageProps): Promise<React.JSX.Element> {
  const {
    locale,
  } = await params;

  const tenantInfo = await getTenantFromUrl(undefined, locale);

  if (!tenantInfo.tenantId) {
    return <CMSConfigError message='No tenant data.' />;
  }

  const homePageData = await fetchHomePageData({
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
