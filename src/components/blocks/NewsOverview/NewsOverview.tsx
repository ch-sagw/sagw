import React from 'react';
import {
  EventsNewsList, InterfaceEventsNewsListPropTypes,
} from '@/components/base/EventsNewsList/EventsNewsList';
import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';

export type InterfaceNewsOverviewPropTypes = Omit<
  InterfaceEventsNewsListPropTypes,
  'children' | 'type'
> & {
  items: InterfaceNewsListItemPropTypes[];
};

export const NewsOverview = ({
  items, title, pagination,
}: InterfaceNewsOverviewPropTypes): React.JSX.Element => (
  <EventsNewsList

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    pagination={pagination!}
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    type='overview'
    title={title}
  >
    {items.map((item, key) => (
      <NewsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsList>
);
