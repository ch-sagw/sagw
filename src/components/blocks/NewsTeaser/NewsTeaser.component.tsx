import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import React from 'react';

export type InterfaceNewsOverviewComponentPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children'
> & {
  items: InterfaceNewsListItemPropTypes[]
};

export const NewsTeaserComponent = (props: InterfaceNewsOverviewComponentPropTypes): React.JSX.Element => (
  <TeaserLinkList
    colorMode='light'
    title={props.title}
    allLink={props.allLink}
  >
    {props.items.map((item, key) => (
      <NewsListItem
        key={key}
        {...item}
      />
    ))}
  </TeaserLinkList>
);
