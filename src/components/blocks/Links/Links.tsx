import React, { Fragment } from 'react';
import { TeaserLinkList } from '@/components/base/TeaserLinkList/TeaserLinkList';
import {
  DownloadLinkItem, InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import { InterfaceLinksBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceLinksPropTypes = {} & InterfaceLinksBlock;

export const Links = (props: InterfaceLinksPropTypes): React.JSX.Element => {
  const title = rteToHtml(props.title);

  // prepare link items
  const items = props.links?.map((link) => {
    if (link.linkType === 'external' && link.linkExternal) {
      const returnLink: InterfaceDownloadLinkItemPropTypes = {
        link: {
          href: link.linkExternal.externalLink,
          target: '_blank' as const,
        },
        text: rteToHtml(link.linkExternal.description),
        title: rteToHtml(link.linkExternal.externalLinkText),
        type: 'link' as const,
      };

      return returnLink;
    } else if (link.linkType === 'internal' && link.linkInternal) {
      const returnLink: InterfaceDownloadLinkItemPropTypes = {
        link: {
          href: `/${link.linkInternal.internalLink}`,
          target: '_self' as const,
        },
        text: rteToHtml(link.linkInternal.description),
        title: rteToHtml(link.linkInternal.linkText),
        type: 'link' as const,
      };

      return returnLink;
    } else if (link.linkType === 'mail' && link.linkMail) {
      const returnLink: InterfaceDownloadLinkItemPropTypes = {
        link: {
          href: link.linkMail.email,
          target: '_blank' as const,
        },
        text: '',
        title: rteToHtml(link.linkMail.linkText),
        type: 'link' as const,
      };

      return returnLink;
    }

    return undefined;
  });

  if (!items) {
    return <Fragment></Fragment>;
  }

  return (
    <TeaserLinkList
      title={title}
      colorMode='light'
    >
      {items.map((item, key) => {
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
};
