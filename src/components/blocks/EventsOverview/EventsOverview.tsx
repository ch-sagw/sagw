import React from 'react';
import {
  EventsNewsOverview, InterfaceEventsNewsOverviewPropTypes,
} from '@/components/base/EventsNewsOverview/EventsNewsOverview';
import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';

export type InterfaceEventsOverviewPropTypes = Omit<
  InterfaceEventsNewsOverviewPropTypes,
  'children' | 'type' | 'colorMode'
> & {
  items: InterfaceEventsListItemPropTypes[];
};

export const EventsOverview = ({
  items, title, paginationTitle,
}: InterfaceEventsOverviewPropTypes): React.JSX.Element => (
  <EventsNewsOverview
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    paginationTitle={paginationTitle!}
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    colorMode='white'
    title={title}
  >
    {items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </EventsNewsOverview>
);
