import { getPayload } from 'payload';
import React from 'react';
import configPromise from '@/payload.config';
import {
  ButtonGroup as ButtonGroupType,
  Config,
} from '@/payload-types';
import { ButtonGroup } from '@/blocks/ButtonGroup/ButtonGroup';

const renderButtonGroup = (element: ButtonGroupType | null | undefined): React.JSX.Element => {

  if (!element) {
    return <p>no buttons</p>;
  }

  return (
    <ButtonGroup key={element.id} {...element} />
  );
};

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
    collection: 'pages',
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
        {pageData.docs[0].elements?.map((element) => (
          renderButtonGroup(element)
        ))}

      </div>
    </div>
  );
}
