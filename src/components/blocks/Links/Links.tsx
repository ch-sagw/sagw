import 'server-only';
import React from 'react';
import { InterfaceLinksBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import {
  CollectionSlug, TypedLocale,
} from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  type InterfaceLinksItem, LinksClient,
} from './Links.client';
import type { InterfaceDownloadLinkItemPropTypes } from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import { buildTrackingEvents } from '@/components/helpers/tracking.constants';
import { getLinksBlockTrackingPrefix } from '@/components/blocks/Links/Links.tracking';

export type InterfaceLinksPropTypes = {
  title: InterfaceRte;
  // Collection of the page hosting this block. External links are tracked
  // in Fathom only on institute and national dictionary detail pages
  // (see Links.tracking.ts).
  sourceCollectionSlug?: CollectionSlug;
} & InterfaceLinksBlock;

export const Links = async (props: InterfaceLinksPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as TypedLocale;

  const titleHtml = rteToHtml(props.title);
  const trackingPrefix = getLinksBlockTrackingPrefix(props.sourceCollectionSlug);

  // Prepare link items
  const items = await Promise.all((props.links || []).map(async (link): Promise<InterfaceLinksItem | null> => {
    if (link.linkType === 'external' && link.linkExternal) {
      const title = rteToHtml(link.linkExternal.externalLinkText);
      const returnLink: InterfaceDownloadLinkItemPropTypes = {
        link: {
          href: link.linkExternal.externalLink,
          target: '_blank' as const,
        },
        text: rteToHtml(link.linkExternal.description),
        title,
        trackingEvents: trackingPrefix
          ? buildTrackingEvents(trackingPrefix, title)
          : undefined,
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

    return null;
  }));

  // Filter out null values
  const validItems = items.filter((item): item is InterfaceLinksItem => item !== null);

  return (
    <LinksClient
      items={validItems}
      titleHtml={titleHtml}
    />
  );
};
