import 'server-only';
import React from 'react';
import {
  InterfaceMagazineTeasersBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { InterfaceMagazineDetailPageWithImage } from '@/components/blocks/MagazineOverview/MagazineOverview';
import { fetchDetailPages } from '@/data/fetch';
import { MagazineTeaserComponent } from './MagazineTeaser.component';
import { getFirstImageIdOfMagazinePage } from '@/components/helpers/magazineImage';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';
import { getPageUrl } from '@/utilities/getPageUrl';

export type InterfaceMagazineTeaserPropTypes = {
  tenant: string;
} & InterfaceMagazineTeasersBlock;

export const MagazineTeaser = async (props: InterfaceMagazineTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;

  const payload = await getPayloadCached();

  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'magazineDetailPage',
    depth: 1,
    language: locale,
    limit: 4,
    sort: 'createdAt',
    tenant,
  }) as InterfaceMagazineDetailPageWithImage[];

  // Find matching image data for magazine teaser items
  const teaserImages = pages.map((page: MagazineDetailPage) => getFirstImageIdOfMagazinePage(page));

  // Attaching image data to magazine teaser items
  for (let i = 0, p = pages.length; i < p; i++) {
    pages[i].image = teaserImages[i];
  }

  const urlMap = await prerenderPageLinks({
    locale,
    pages,
    payload,
  });

  // Pre-generate URL for optional link if it exists
  let optionalLinkUrl: string | undefined;

  if (restProps.optionalLink?.includeLink && restProps.optionalLink.link?.internalLink?.documentId) {
    optionalLinkUrl = await getPageUrl({
      locale,
      pageId: restProps.optionalLink.link.internalLink.documentId,
      payload,
    });
  }

  return (
    <MagazineTeaserComponent
      {...restProps}
      pages={pages}
      pageUrls={urlMap}
      optionalLinkUrl={optionalLinkUrl}
    />
  );
};
