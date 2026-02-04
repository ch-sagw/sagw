import 'server-only';
import React from 'react';
import {
  Image,
  InterfaceMagazineOverviewBlock,
  MagazineDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import { MagazineOverviewComponent } from '@/components/blocks/MagazineOverview/MagazineOverview.component';
import { getFirstImageIdOfMagazinePage } from '@/components/helpers/magazineImage';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';

export type InterfaceMagazineOverviewPropTypes = {
  tenant: string;
} & InterfaceMagazineOverviewBlock;

export type InterfaceMagazineDetailPageWithImage = {
  image: Image | string;
} & MagazineDetailPage;

export const MagazineOverview = async (props: InterfaceMagazineOverviewPropTypes): Promise<React.JSX.Element> => {
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
    limit: 0,
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

  return (
    <MagazineOverviewComponent
      pages={pages}
      pageUrls={urlMap}
      {...restProps}
    />
  );

};
