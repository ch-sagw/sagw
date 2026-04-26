import 'server-only';
import React from 'react';
import { TypedLocale } from 'payload';
import { ColorMode } from '@/components/base/types/colorMode';
import {
  Header, InterfaceHeaderPropTypes,
} from '@/components/global/Header/Header';
import {
  getLocale, getTranslations,
} from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { CMSConfigError } from '@/app/(frontend)/utilities/CMSConfigError';
import {
  getEnabledLocalesForTenant, getTenantById,
} from '@/utilities/tenant';
import { getServerSideURL } from '@/utilities/getUrl';

type InterfaceHeaderRendererProps = {
  colorMode: ColorMode;
  tenant: string;
  currentPageId?: string;
}

export const RenderHeader = async ({
  colorMode,
  tenant,
  currentPageId,
}: InterfaceHeaderRendererProps): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as TypedLocale;
  const i18nMenu = await getTranslations('menu');
  const tenantName = await getTenantById({
    id: tenant,
  });
  const enabledLocales = getEnabledLocalesForTenant(tenantName);

  // get host origin
  const origin = getServerSideURL()
    .replace(/\/+$/u, '');

  // get header data
  const headerData = await payload.find({
    collection: 'header',
    depth: 1,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!headerData.docs || headerData.docs.length !== 1) {
    return <CMSConfigError message='No header data' />;
  }

  // get nav data
  const navData = headerData.docs[0].navigation;

  if (!navData || navData.navItems.length < 1) {
    return <CMSConfigError message='No nav items in header data' />;
  }

  // get metanav data
  const metanavData = headerData.docs[0].metanavigation;

  if (!metanavData?.metaLinks || metanavData.metaLinks.length < 1) {
    return <CMSConfigError message='No metanav data in header data' />;
  }

  // logo link
  let logoLink = `${origin}/${locale}`;

  if (tenantName.slug !== 'sagw') {
    logoLink = `${origin}/${locale}/${tenantName.slug}`;
  }

  const headerProps: InterfaceHeaderPropTypes = {
    colorMode,
    documentId: currentPageId,
    enabledLocales,
    logoLink,
    menuButton: {
      close: i18nMenu('close'),
      open: i18nMenu('open'),
    },
    metanav: metanavData,
    navigation: navData,
    tenant: tenantName.slug || 'sagw',
    tenantSlug: tenantName.slug,
  };

  return (
    <Header
      {...headerProps}
    />
  );
};
