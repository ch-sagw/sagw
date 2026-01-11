'use client';

import React from 'react';
import { TeaserLinkList } from '@/components/base/TeaserLinkList/TeaserLinkList';
import {
  DownloadLinkItem, type InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';

export type InterfaceLinksItem = InterfaceDownloadLinkItemPropTypes;

export type InterfaceLinksClientPropTypes = {
  items: InterfaceLinksItem[];
  titleHtml: string;
};

export const LinksClient = ({
  items,
  titleHtml,
}: InterfaceLinksClientPropTypes): React.JSX.Element => (
  <TeaserLinkList
    colorMode='light'
    title={titleHtml}
  >
    {items.map((item, key) => (
      <DownloadLinkItem
        key={key}
        {...item}
      />
    ))}
  </TeaserLinkList>
);

