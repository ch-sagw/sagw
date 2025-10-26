import 'server-only';
import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';
import { RenderBlocks } from '@/app/(frontend)/RenderBlocks';
import { getTenant } from '@/app/providers/TenantProvider.server';

// TODO: properly invalidate cache via afterChange hook on collection level
// and revalidatePath from next/cache

export const revalidate = 0;
// export const dynamic = 'force-static';

/*
export const generateStaticParams = () => [
  {
    lang: 'en',
  },
  {
    lang: 'de',
  },
  {
    lang: 'fr',
  },
];
*/

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<React.JSX.Element> {

  const lang = (await params).lang as Config['locale'] || 'de';
  const payload = await getPayload({
    config: configPromise,
  });

  const tenant: string | null = await getTenant();

  if (!tenant) {
    return <p>No tenant data</p>;
  }

  // page data

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

  if (!pagesData.docs || pagesData.docs.length < 1) {
    return <p>No pages data</p>;
  }

  const [pageData] = pagesData.docs;

  // i18n

  const i18nDataDocs = await payload.find({
    collection: 'i18nGlobals',
    depth: 1,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!i18nDataDocs.docs || i18nDataDocs.docs.length < 1) {
    return <p>No i18n data</p>;
  }

  const [i18nData] = i18nDataDocs.docs;

  return (
    <Fragment>
      <div className='home'>
        <RenderBlocks
          i18n={i18nData}
          blocks={pageData.content}
          tenantId={tenant}
          pageLanguage={lang}
        />
      </div>
    </Fragment>
  );
}
