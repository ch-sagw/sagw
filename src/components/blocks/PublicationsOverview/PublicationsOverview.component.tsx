import React from 'react';
import {
  InterfacePublicationsOverviewPropTypes,
  PublicationsOverview,
} from '@/components/base/PublicationsOverview/PublicationsOverview';
import {
  InterfacePublicationsListItemPropTypes,
  PublicationsListItem,
} from '@/components/base/PublicationsListItem/PublicationsListItem';

export type InterfacePublicationsOverviewComponentPropTypes = Omit<
    InterfacePublicationsOverviewPropTypes,
    'children'
> & {
    items: InterfacePublicationsListItemPropTypes[]
};

export const PublicationsOverviewComponent = (props: InterfacePublicationsOverviewComponentPropTypes): React.JSX.Element => (
  <PublicationsOverview
    title={props.title}
    colorMode='white'
    filters={props.filters}
    notification={props.notification}
    paginationTitle={props.paginationTitle}
  >
    {props.items.map((item, key) => (
      <PublicationsListItem
        key={key}
        {...item}
      />
    ))}
  </PublicationsOverview>
);
