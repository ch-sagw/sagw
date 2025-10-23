import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import { Config } from '@/payload-types';
import React from 'react';

export type InterfaceNewsOverviewComponentPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children' | 'colorMode'
> & {
  items: InterfaceNewsListItemPropTypes[];
  pageLanguage: Config['locale'];
};

export const NewsTeaserComponent = (props: InterfaceNewsOverviewComponentPropTypes): React.JSX.Element => (
  <TeaserLinkList
    pageLanguage={props.pageLanguage}
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
