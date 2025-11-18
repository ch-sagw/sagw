import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { NewsOverviewComponent } from '@/components/blocks/NewsOverview/NewsOverview.component';
import {
  Config, InterfaceNewsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { convertPayloadNewsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';

type InterfaceNewsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceNewsOverviewBlock;

export const NewsOverview = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {

  const payload = await getPayload({
    config: configPromise,
  });

  // Get news pages data
  const newsPages = await payload.find({
    collection: 'newsDetailPage',
    depth: 1,
    limit: 0,
    locale: props.language,
    pagination: false,
    sort: '-hero.date',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);

  const items = convertPayloadNewsPagesToFeItems(newsPages, props.language);

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <NewsOverviewComponent
      title={title}
      paginationTitle='Pagination'
      colorMode='white'
      items={items}
    />
  );
};
