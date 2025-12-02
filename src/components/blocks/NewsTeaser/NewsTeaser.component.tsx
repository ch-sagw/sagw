import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import { ColorMode } from '@/components/base/types/colorMode';
import React from 'react';

export type InterfaceNewsOverviewComponentPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children' | 'colorMode'
> & {
  items: InterfaceNewsListItemPropTypes[];
  colorMode: ColorMode;
};

export const NewsTeaserComponent = (props: InterfaceNewsOverviewComponentPropTypes): React.JSX.Element => (
  <TeaserLinkList
    colorMode={props.colorMode}
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
