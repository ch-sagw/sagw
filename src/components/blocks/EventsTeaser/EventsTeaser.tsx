import React from 'react';
import {
  EventsNewsList, InterfaceEventsNewsListPropTypes,
} from '@/components/base/EventsNewsList/EventsNewsList';
import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';

export type InterfaceEventsTeaserPropTypes = Omit<
  InterfaceEventsNewsListPropTypes,
  'children' | 'type' | 'colorMode'
> & {
  items: InterfaceEventsListItemPropTypes[];
};

export const EventsTeaser = ({
  items, title, allLink,
}: InterfaceEventsTeaserPropTypes): React.JSX.Element => (
  <EventsNewsList
    colorMode='white'
    type='teaser'
    title={title}
    allLink={allLink}
  >
    {items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsList>
);
