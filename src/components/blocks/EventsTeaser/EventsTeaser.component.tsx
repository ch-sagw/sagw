import {
  EventsListItem, InterfaceEventsListItemPropTypes,
} from '@/components/base/EventsListItem/EventsListItem';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import { Config } from '@/payload-types';
import React from 'react';

export type InterfaceEventsOverviewComponentPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children' | 'colorMode'
> & {
  items: InterfaceEventsListItemPropTypes[];
  pageLanguage: Config['locale'];
};

export const EventsTeaserComponent = (props: InterfaceEventsOverviewComponentPropTypes): React.JSX.Element => (
  <TeaserLinkList
    colorMode='white'
    title={props.title}
    allLink={props.allLink}
    pageLanguage={props.pageLanguage}
  >
    {props.items.map((item, key) => (
      <EventsListItem
        key={key}
        {...item}
      />
    ))}
  </TeaserLinkList>
);
