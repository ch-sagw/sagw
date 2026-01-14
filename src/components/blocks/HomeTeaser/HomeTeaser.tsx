import 'server-only';
import React from 'react';
import { InterfaceHomeTeasersBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  HomeTeaserClient, type InterfaceHomeTeaserItem,
} from './HomeTeaser.client';

export type InterfaceHomeTeaserPropTypes = {} & InterfaceHomeTeasersBlock;

export const HomeTeaser = async ({
  homeTeasers,
}: InterfaceHomeTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = await getLocale() as TypedLocale;
  const payload = await getPayloadCached();

  if (!homeTeasers || homeTeasers.length === 0) {
    return <HomeTeaserClient teasers={[]} />;
  }

  // Process all teasers in parallel
  const processedTeasers = await Promise.all(homeTeasers.map(async (teaser): Promise<InterfaceHomeTeaserItem> => {
    const linkHref = await getPageUrl({
      locale,
      pageId: teaser.link.internalLink.documentId,
      payload,
    });

    return {
      category: teaser.category,
      iconName: teaser.iconName,
      linkHref,
      linkTextHtml: rteToHtml(teaser.link.linkText),
      textHtml: rteToHtml(teaser.text),
      titleHtml: rteToHtml(teaser.title),
    };
  }));

  return <HomeTeaserClient teasers={processedTeasers} />;
};
