import React from 'react';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';

export type InterfaceEventsTeaserPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children' | 'type' | 'colorMode'
> & {
  items: InterfaceEventsListItemPropTypes[];
};

export const EventsTeaser = ({
  items, title, allLink,
}: InterfaceEventsTeaserPropTypes): React.JSX.Element => (
  <TeaserLinkList
    colorMode='white'
    title={title}
    allLink={allLink}
  >
    {items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </TeaserLinkList>
);
