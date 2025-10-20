import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { NewsOverviewComponent } from '@/components/blocks/NewsOverview/NewsOverview.component';
import { InterfaceNewsListItemPropTypes } from '@/components/base/NewsListItem/NewsListItem';
import {
  Config, InterfaceNewsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { formatDateToReadableString } from '@/components/helpers/date';

export type InterfaceNewsOverviewPropTypes = {
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
    overrideAccess: false,
    pagination: false,
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);

  const items = newsPages.docs.map((newsPage) => {
    const returnNewsPage: InterfaceNewsListItemPropTypes = {
      date: formatDateToReadableString({
        dateString: newsPage.hero.date,
        locale: props.language,
      }),

      // TODO
      link: newsPage.slug || '',

      text: rteToHtml(newsPage.overviewPageProps.teaserText),
      title: rteToHtml(newsPage.hero.title),
    };

    return returnNewsPage;
  });

  return (
    <NewsOverviewComponent
      title={title}
      paginationTitle='Pagination'
      colorMode='white'
      items={items}
    />
  );
};
