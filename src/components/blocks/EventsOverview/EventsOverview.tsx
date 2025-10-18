import React from 'react';
import {
  EventsNewsList, InterfaceEventsNewsListPropTypes,
} from '@/components/base/EventsNewsList/EventsNewsList';
import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';

export type InterfaceEventsOverviewPropTypes = Omit<
  InterfaceEventsNewsListPropTypes,
  'children' | 'type' | 'colorMode'
> & {
  items: InterfaceEventsListItemPropTypes[];
};

export const EventsOverview = ({
  items, title, pagination,
}: InterfaceEventsOverviewPropTypes): React.JSX.Element => (
  <EventsNewsList
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    pagination={pagination!}
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    type='overview'
    colorMode='white'
    title={title}
  >
    {items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsList>
);
