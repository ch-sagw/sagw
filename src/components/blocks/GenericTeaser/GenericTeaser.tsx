import 'server-only';
import React from 'react';
import { InterfaceGenericTeasersBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import {
  GenericTeaserClient, type InterfaceGenericTeaserItem,
} from './GenericTeaser.client';

export type InterfaceGenericTeaserPropTypes = {} & InterfaceGenericTeasersBlock;

export const GenericTeaser = async ({
  title,
  lead,
  alignment,
  teasers,
}: InterfaceGenericTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = await getLocale() as TypedLocale;
  const payload = await getPayloadCached();

  const titleHtml = rteToHtml(title);
  const subtitleHtml = rteToHtml(lead);

  // Process all teasers in parallel
  const processedTeasers = await Promise.all(teasers.map(async (item): Promise<InterfaceGenericTeaserItem | null> => {
    let href: string | undefined;
    let text: string | undefined;

    if (item.linkType === 'external' && item.linkExternal) {
      href = item.linkExternal.externalLink;
      text = rte1ToPlaintext(item.linkExternal?.externalLinkText);
    } else if (item.linkType === 'internal' && item.linkInternal) {
      href = await getPageUrl({
        locale,
        pageId: item.linkInternal.internalLink.documentId,
        payload,
      });
      text = rte1ToPlaintext(item.linkInternal?.linkText);
    } else if (item.linkType === 'mail' && item.linkMail) {
      href = item.linkMail?.email;
      text = rte1ToPlaintext(item.linkMail?.linkText);
    }

    if (!href || !text) {
      return null;
    }

    return {
      id: item.id,
      link: {
        href,
        text,
        type: item.linkType,
      },
      textHtml: rteToHtml(item.text),
      titleHtml: rteToHtml(item.title),
    };
  }));

  // Filter out null values
  const validTeasers = processedTeasers.filter((teaser): teaser is InterfaceGenericTeaserItem => teaser !== null);

  return (
    <GenericTeaserClient
      alignment={alignment}
      subtitleHtml={subtitleHtml}
      teasers={validTeasers}
      titleHtml={titleHtml}
    />
  );
};
