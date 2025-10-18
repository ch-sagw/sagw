import React from 'react';
import {
  EventsNewsList, InterfaceEventsNewsListPropTypes,
} from '@/components/base/EventsNewsList/EventsNewsList';
import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';

export type InterfaceNewsTeaserPropTypes = Omit<
  InterfaceEventsNewsListPropTypes,
  'children' | 'type'
> & {
  items: InterfaceNewsListItemPropTypes[];
};

export const NewsTeaser = ({
  items, title, allLink,
}: InterfaceNewsTeaserPropTypes): React.JSX.Element => (
  <EventsNewsList
    type='teaser'
    title={title}
    allLink={allLink}
  >
    {items.map((item, key) => (
      <NewsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsList>
);
