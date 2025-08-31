import { getPayload } from 'payload';
import React from 'react';
import configPromise from '@/payload.config';
import { Config } from '@/payload-types';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<React.JSX.Element> {

  const lang = (await params).lang as Config['locale'];
  const payload = await getPayload({
    config: configPromise,
  });

  const pageData = await payload.find({
    collection: 'homePage',
    depth: 0,
    limit: 1,
    locale: lang,
    overrideAccess: false,
  });

  if (!pageData.docs || pageData.docs.length < 1) {
    return <p>No data</p>;
  }

  return (
    <div className='home'>
      <div className='content'>
        todo
      </div>
    </div>
  );
}
