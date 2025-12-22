import 'server-only';
import React from 'react';
import {
  InterfaceProjectTeasersBlock,
  ProjectDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { rteToHtml } from '@/utilities/rteToHtml';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  type InterfaceProjectsTeaserItem, ProjectsTeaserClient,
} from './ProjectsTeaser.client';

export type InterfaceProjectsTeaserPropTypes = {
  tenant: string;
} & InterfaceProjectTeasersBlock;

export const ProjectsTeaser = async (props: InterfaceProjectsTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
    title,
    lead,
    alignement,
    optionalLink,
  } = props;

  const pages = await fetchDetailPages({
    collection: 'projectDetailPage',
    language: locale,
    limit: 3,
    sort: 'createdAt',
    tenant,
  }) as ProjectDetailPage[];

  const titleHtml = rteToHtml(title);
  const subtitleHtml = rteToHtml(lead);

  // Process optional link
  let processedOptionalLink: { href: string; linkTextHtml: string } | null = null;

  if (optionalLink && optionalLink.includeLink && optionalLink.link?.internalLink && optionalLink.link?.linkText) {
    const href = await getPageUrl({
      locale,
      pageId: optionalLink.link.internalLink.documentId,
      payload,
    });

    processedOptionalLink = {
      href,
      linkTextHtml: rteToHtml(optionalLink.link.linkText),
    };
  }

  // Process all pages in parallel
  const items = await Promise.all(pages.map(async (item): Promise<InterfaceProjectsTeaserItem> => {
    const href = await getPageUrl({
      locale,
      pageId: item.id,
      payload,
    });

    return {
      id: item.id,
      link: {
        href,
        text: rteToHtml(item.overviewPageProps.linkText),
        type: 'internal' as const,
      },
      textHtml: rteToHtml(item.overviewPageProps.teaserText),
      titleHtml: rteToHtml(item.hero.title),
    };
  }));

  return (
    <ProjectsTeaserClient
      alignement={alignement}
      items={items}
      optionalLink={processedOptionalLink}
      subtitleHtml={subtitleHtml}
      titleHtml={titleHtml}
    />
  );
};
