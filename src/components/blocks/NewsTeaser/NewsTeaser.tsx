import React from 'react';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';

export type InterfaceNewsTeaserPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children' | 'type' | 'colorMode'
> & {
  items: InterfaceNewsListItemPropTypes[];
};

export const NewsTeaser = ({
  items, title, allLink,
}: InterfaceNewsTeaserPropTypes): React.JSX.Element => (
  <TeaserLinkList
    colorMode='light'
    title={title}
    allLink={allLink}
  >
    {items.map((item, key) => (
      <NewsListItem
        key={key}
        {...item}
      />
    ))}
  </TeaserLinkList>
);
