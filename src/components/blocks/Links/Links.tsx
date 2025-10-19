import React from 'react';
import {
  DownloadLinkList, InterfaceDownloadLinkListPropTypes,
} from '@/components/base/DownloadLinkList/DownloadLinkList';
import {
  DownloadLinkItem, InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';

export type InterfaceLinksPropTypes = Omit<
  InterfaceDownloadLinkListPropTypes,
  'children' | 'type'
> & {
  items: InterfaceDownloadLinkItemPropTypes[];
};

export const Links = ({
  items, title,
}: InterfaceLinksPropTypes): React.JSX.Element => (
  <DownloadLinkList
    type='link'
    title={title}
  >
    {items.map((item, key) => (
      <DownloadLinkItem
        key={key}
        {...item}
      />
    ))}
  </DownloadLinkList>
);
