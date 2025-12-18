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
import configPromise from '@/payload.config';
import {
  getPayload,
  TypedLocale,
} from 'payload';

export type InterfaceMagazineOverviewPropTypes = {
  tenant: string;
  image: Image;
} & InterfaceMagazineOverviewBlock;

export type InterfaceMagazineDetailPageWithImage = {
  image: Image | string;
} & MagazineDetailPage;

export const MagazineOverview = async (props: InterfaceMagazineOverviewPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const locale = (await getLocale()) as TypedLocale;
  const {
    tenant,
    ...restProps
  } = props;

  const pages = await fetchDetailPages({
    collection: 'magazineDetailPage',
    language: locale,
    limit: 0,
    sort: 'createdAt',
    tenant,
  }) as InterfaceMagazineDetailPageWithImage[];

  const images = await payload.find({
    collection: 'images',
    depth: 0,
    limit: 0,
    pagination: false,
    sort: 'createdAt',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  // Find matching image data for magazine teaser items
  const teaserImageIds = pages.map((page: MagazineDetailPage) => getFirstImageIdOfMagazinePage(page));

  const imagesData = teaserImageIds.map((id) => {
    if (!id) {
      return '';
    }

    const match = images.docs.find((img) => img.id === id);

    return match || '';
  });

  // Attaching image data to magazine teaser items
  for (let i = 0, p = pages.length; i < p; i++) {
    pages[i].image = imagesData[i];
  }

  return (
    <MagazineOverviewComponent
      pages={pages}
      {...restProps}
    />
  );

};
