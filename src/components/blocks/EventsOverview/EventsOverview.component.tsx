import React from 'react';
import {
  EventsNewsOverview, InterfaceEventsNewsOverviewPropTypes,
} from '@/components/base/EventsNewsOverview/EventsNewsOverview';
import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';
import { Config } from '@/payload-types';

export type InterfaceEventsOverviewComponentPropTypes = Omit<
  InterfaceEventsNewsOverviewPropTypes,
  'children'
> & {
  items: InterfaceEventsListItemPropTypes[];
  pageLanguage: Config['locale'];
};

export const EventsOverviewComponent = (props: InterfaceEventsOverviewComponentPropTypes): React.JSX.Element => (
  <EventsNewsOverview
    title={props.title}
    colorMode='white'
    pageLanguage={props.pageLanguage}
  >
    {props.items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsOverview>
);
