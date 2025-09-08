import { getPayload } from 'payload';
import React from 'react';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';
import { Navigation } from '@/components/global/Navigation/Navigation';
// import { Notification } from '@/components/blocks/Notification/Notification';
// import { Rte } from '@/components/blocks/Rte/Rte';
import { RenderBlocks } from '@/app/(frontend)/RenderBlocks';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<React.JSX.Element> {

  const lang = (await params).lang as Config['locale'];
  const payload = await getPayload({
    config: configPromise,
  });

  const tenants = await payload.find({
    collection: 'departments',
    depth: 1,
    where: {
      name: {
        equals: 'SAGW',
      },
    },
  });

  if (!tenants.docs || tenants.docs.length < 1) {
    return <p>No tenant data</p>;
  }

  const tenant = tenants.docs[0].id;

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
      <RenderBlocks blocks={pageData.content} />
    </div>
  );
}
