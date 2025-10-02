import 'server-only';
import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';
import { RenderBlocks } from '@/app/(frontend)/RenderBlocks';
import { getTenant } from '@/app/providers/TenantProvider.server';
import { Header } from '@/components/global/Header/Header';
import { ColorMode } from '@/components/base/types/colorMode';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<React.JSX.Element> {

  const lang = (await params).lang as Config['locale'];
  const payload = await getPayload({
    config: configPromise,
  });

  const tenant: string | null = await getTenant();

  if (!tenant) {
    return <p>No tenant data</p>;
  }

  const pagesData = await payload.find({
    collection: 'homePage',
    depth: 1,
    limit: 1,
    locale: lang,
    overrideAccess: false,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const headerData = await payload.find({
    collection: 'header',
    depth: 1,
    limit: 1,
    locale: lang,
    overrideAccess: false,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!pagesData.docs || pagesData.docs.length < 1) {
    return <p>No pages data</p>;
  }

  if (!headerData.docs || headerData.docs.length < 1) {
    return <p>No header data </p>;
  }

  const [pageData] = pagesData.docs;

  const navData = headerData.docs[0].navigation;

  if (!navData || navData.navItems.length < 1) {
    return <p>No nav items in header data</p>;
  }

  const langnavData = headerData.docs[0].languageNavigation;

  if (!langnavData || !langnavData.description || !langnavData.title) {
    return <p>No lang nav data in header data</p>;
  }

  const metanavData = headerData.docs[0].metanavigation;

  if (!metanavData?.metaLinks || metanavData.metaLinks.length < 1) {
    return <p>No metanav data in header data</p>;
  }

  const logoData = headerData.docs[0].logo;

  if (!logoData) {
    return <p>No logo data in header data</p>;
  }

  const colorMode: ColorMode = 'dark';

  const headerProps = {
    colorMode,
    currentLang: 'de',
    langnav: langnavData,
    logo: logoData,
    menuButton: {
      close: 'Close',
      open: 'Open',
    },
    metanav: metanavData,
    navigation: navData,
  };

  return (
    <Fragment>
      <Header
        {...headerProps}
      />

      <div className='home'>
        <RenderBlocks
          blocks={pageData.content}
          tenantId={tenant}
        />
      </div>
    </Fragment>
  );
}
