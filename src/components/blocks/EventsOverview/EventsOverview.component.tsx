import React from 'react';
import {
  EventsNewsOverview, InterfaceEventsNewsOverviewPropTypes,
} from '@/components/base/EventsNewsOverview/EventsNewsOverview';
import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';

export type InterfaceEventsOverviewComponentPropTypes = Omit<
  InterfaceEventsNewsOverviewPropTypes,
  'children'
> & {
  items: InterfaceEventsListItemPropTypes[];
};

export const EventsOverviewComponent = (props: InterfaceEventsOverviewComponentPropTypes): React.JSX.Element => (
  <EventsNewsOverview
    title={props.title}
    colorMode='white'
  >
    {props.items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsOverview>
);
