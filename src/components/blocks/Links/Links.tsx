import 'server-only';
import React, { Fragment } from 'react';
import { TeaserLinkList } from '@/components/base/TeaserLinkList/TeaserLinkList';
import {
  DownloadLinkItem, InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import { InterfaceLinksBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import { TypedLocale } from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceLinksPropTypes = {
  title: InterfaceRte;
} & InterfaceLinksBlock;

export const Links = async (props: InterfaceLinksPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();

  const locale = (await getLocale()) as TypedLocale;

  const title = rteToHtml(props.title);

  // prepare link items
  const items = await Promise.all((props.links || []).map(async (link) => {
    if (link.linkType === 'external' && link.linkExternal) {
      const returnLink: InterfaceDownloadLinkItemPropTypes = {
        link: {
          href: link.linkExternal.externalLink,
          target: '_blank' as const,
        },
        text: await rteToHtml(link.linkExternal.description),
        title: await rteToHtml(link.linkExternal.externalLinkText),
        type: 'link' as const,
      };

      return returnLink;
    } else if (link.linkType === 'internal' && link.linkInternal) {
      const href = await getPageUrl({
        locale,
        pageId: link.linkInternal.internalLink.documentId,
        payload,
      });

      const returnLink: InterfaceDownloadLinkItemPropTypes = {
        link: {
          href,
          target: '_self' as const,
        },
        text: await rteToHtml(link.linkInternal.description),
        title: await rteToHtml(link.linkInternal.linkText),
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
        title: await rteToHtml(link.linkMail.linkText),
        type: 'link' as const,
      };

      return returnLink;
    }

    return undefined;
  }));

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
