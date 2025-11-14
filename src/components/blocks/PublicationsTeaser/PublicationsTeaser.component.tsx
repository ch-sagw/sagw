import {
  InterfacePublicationsListItemPropTypes,
  PublicationsListItem,
} from '@/components/base/PublicationsListItem/PublicationsListItem';
import {
  InterfaceTeaserLinkListPropTypes,
  TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import { Config } from '@/payload-types';
import React from 'react';

export type InterfacePublicationsOverviewComponentPropTypes = Omit<
    InterfaceTeaserLinkListPropTypes,
    'children' | 'colorMode'
> & {
    items: InterfacePublicationsListItemPropTypes[];
    pageLanguage: Config['locale'];
};

export const PublicationsTeaserComponent = (props: InterfacePublicationsOverviewComponentPropTypes): React.JSX.Element => (
  <TeaserLinkList
    allLink={props.allLink}
    colorMode='white'
    style='publications'
    title={props.title}
    pageLanguage={props.pageLanguage}
  >
    {props.items.map((item, key) => (
      <PublicationsListItem
        key={key}
        {...item}
      />
    ))}
  </TeaserLinkList>
);

