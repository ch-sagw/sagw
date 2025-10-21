import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import React from 'react';

export type InterfaceEventsOverviewComponentPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children'
> & {
  items: InterfaceEventsListItemPropTypes[]
};

export const EventsTeaserComponent = (props: InterfaceEventsOverviewComponentPropTypes): React.JSX.Element => (
  <TeaserLinkList
    colorMode='light'
    title={props.title}
    allLink={props.allLink}
  >
    {props.items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </TeaserLinkList>
);
