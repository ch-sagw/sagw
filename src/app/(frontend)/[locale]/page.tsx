import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { RenderPage } from '@/app/(frontend)/renderers/RenderPage';
import { getTenantFromUrl } from '@/app/(frontend)/utilities/getTenantFromUrl';
import { CMSConfigError } from '../utilities/CMSConfigError';
import { getLocaleCodes } from '@/i18n/payloadConfig';

type InterfacePageProps = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export const generateStaticParams = (): { locale: TypedLocale }[] => {
  const locales = getLocaleCodes();

  return locales.map((locale) => ({
    locale,
  }));
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

  return (
    <RenderPage
      isHome={true}
      locale={locale}
      tenantId={tenantInfo.tenantId}
    />
  );
}
