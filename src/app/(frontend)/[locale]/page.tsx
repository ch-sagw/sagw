import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { RenderPage } from '@/app/(frontend)/renderers/RenderPage';
import { getTenantFromUrl } from '@/app/(frontend)/utilities/getTenantFromUrl';
import { CMSConfigError } from '../utilities/CMSConfigError';

type InterfacePageProps = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export const revalidate = 0;
// export const dynamic = 'force-static';

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
