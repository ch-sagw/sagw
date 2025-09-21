import 'server-only';
import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';
import { Navigation } from '@/components/global/Navigation/Navigation';
import { RenderBlocks } from '@/app/(frontend)/RenderBlocks';
import { getTenant } from '@/app/providers/TenantProvider.server';

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
      department: {
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
      department: {
        equals: tenant,
      },
    },
  });

  if (!pagesData.docs || pagesData.docs.length < 1) {
    return <p>No data</p>;
  }

  if (!headerData.docs || headerData.docs.length < 1) {
    return <p>No data</p>;
  }

  const navData = headerData.docs[0].navigation;
  const [pageData] = pagesData.docs;

  if (!navData || navData.navItems.length < 1) {
    return <p>No data</p>;
  }

  return (
    <div className='home'>
      <Navigation navItems={navData.navItems} />
      <RenderBlocks
        blocks={pageData.content}
        tenantId={tenant}
      />
    </div>
  );
}
