import React, { Fragment } from 'react';
import {
  getPayload, TypedLocale,
} from 'payload';
import configPromise from '@/payload.config';

import { NewsOverviewComponent } from '@/components/blocks/NewsOverview/NewsOverview.component';
import { InterfaceNewsOverviewBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { convertPayloadNewsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { getLocale } from 'next-intl/server';

type InterfaceNewsOverviewPropTypes = {
  tenant: string;
} & InterfaceNewsOverviewBlock;

export const NewsOverview = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayload({
    config: configPromise,
  });

  // Get news pages data
  const newsPages = await payload.find({
    collection: 'newsDetailPage',
    depth: 1,
    limit: 0,
    locale,
    pagination: false,
    sort: '-hero.date',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);

  const items = convertPayloadNewsPagesToFeItems(newsPages, locale);

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <NewsOverviewComponent
      title={title}
      colorMode='white'
      items={items}
    />
  );
};
