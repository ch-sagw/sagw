import React from 'react';
import {
  DownloadLinkList, InterfaceDownloadLinkListPropTypes,
} from '@/components/base/DownloadLinkList/DownloadLinkList';
import {
  DownloadLinkItem, InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';

export type InterfaceDownloadsPropTypes = Omit<
  InterfaceDownloadLinkListPropTypes,
  'children' | 'type'
> & {
  items: InterfaceDownloadLinkItemPropTypes[];
};

export const Downloads = ({
  items, title, allLink,
}: InterfaceDownloadsPropTypes): React.JSX.Element => (
  <DownloadLinkList
    type='download'
    title={title}
    allLink={allLink}
  >
    {items.map((item, key) => (
      <DownloadLinkItem
        key={key}
        {...item}
      />
    ))}
  </DownloadLinkList>
);
