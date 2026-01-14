import 'server-only';
import React, { Fragment } from 'react';
import { NewsOverviewComponent } from '@/components/blocks/NewsOverview/NewsOverview.component';
import { InterfaceNewsOverviewBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { convertPayloadNewsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { getLocale } from 'next-intl/server';
import { fetchNewsOverviewPages } from '@/data/fetch';
import { TypedLocale } from 'payload';

type InterfaceNewsOverviewPropTypes = {
  tenant: string;
} & InterfaceNewsOverviewBlock;

export const NewsOverview = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;

  // Get news pages data
  const newsPages = await fetchNewsOverviewPages({
    locale,
    tenant: props.tenant,
  });

  const title = rteToHtml(props.title);

  const items = await convertPayloadNewsPagesToFeItems(newsPages, locale);

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
