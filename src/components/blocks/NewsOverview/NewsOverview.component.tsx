import React from 'react';
import {
  EventsNewsOverview, InterfaceEventsNewsOverviewPropTypes,
} from '@/components/base/EventsNewsOverview/EventsNewsOverview';
import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';

export type InterfaceNewsOverviewComponentPropTypes = Omit<
  InterfaceEventsNewsOverviewPropTypes,
  'children'
> & {
  items: InterfaceNewsListItemPropTypes[]
};

export const NewsOverviewComponent = (props: InterfaceNewsOverviewComponentPropTypes): React.JSX.Element => (
  <EventsNewsOverview
    title={props.title}
    colorMode='white'
    paginationTitle={props.paginationTitle}
  >
    {props.items.map((item, key) => (
      <NewsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsOverview>
);
