import {
  DownloadLinkItem, InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import {
  InterfaceTeaserLinkListPropTypes, TeaserLinkList,
} from '@/components/base/TeaserLinkList/TeaserLinkList';
import React from 'react';

export type InterfaceDownloadsComponentPropTypes = Omit<
  InterfaceTeaserLinkListPropTypes,
  'children' | 'colorMode'
> & {
  items: InterfaceDownloadLinkItemPropTypes[];
};

export const DownloadsComponent = (props: InterfaceDownloadsComponentPropTypes): React.JSX.Element => (
  <TeaserLinkList
    title={props.title}
    subtitle={props.subtitle}
    colorMode='light'
  >
    {props.items.map((item, key) => {
      if (item) {
        return (
          <DownloadLinkItem
            key={key}
            {...item}
          />
        );
      }

      return undefined;
    })}
  </TeaserLinkList>
);
