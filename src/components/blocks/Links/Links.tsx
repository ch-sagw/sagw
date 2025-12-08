import React, { Fragment } from 'react';
import { TeaserLinkList } from '@/components/base/TeaserLinkList/TeaserLinkList';
import {
  DownloadLinkItem, InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import { InterfaceLinksBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import { getInternalLinkPath } from '@/utilities/getInternalLinkPath';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceLinksPropTypes = {
  title: InterfaceRte;
} & InterfaceLinksBlock;

export const Links = async (props: InterfaceLinksPropTypes): Promise<React.JSX.Element> => {
  const locale = await getLocale() as TypedLocale;
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
          href: getInternalLinkPath(link.linkInternal.internalLink, locale),
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
