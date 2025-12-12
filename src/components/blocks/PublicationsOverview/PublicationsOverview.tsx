import React, { Fragment } from 'react';
import configPromise from '@/payload.config';

import { PublicationsOverview } from '@/components/base/PublicationsOverview/PublicationsOverview';
import { InterfacePublicationsOverviewBlock } from '@/payload-types';
import {
  convertPayloadPublicationsPagesToFeItems,
  prepareFilterItems,
} from '@/components/blocks/helpers/dataTransformers';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';
import { getLocale } from 'next-intl/server';
import {
  getPayload,
  TypedLocale,
} from 'payload';
import { getImageDataForUniqueIds } from '@/components/blocks/helpers/getImageData';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';

type InterfaceNewsOverviewPropTypes = {
  tenant: string;
} & InterfacePublicationsOverviewBlock;

export const PublicationsOverviewBlock = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const locale = (await getLocale()) as TypedLocale;

  // Get publication detail pages data
  // =========================
  const publicationPages = await payload.find({
    collection: 'publicationDetailPage',
    depth: 1,
    limit: 0,
    locale,
    overrideAccess: false,
    pagination: false,
    sort: '-overviewPageProps.date',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const publicationTopics = await payload.find({
    collection: 'publicationTopics',
    locale,
    sort: 'publicationTopic.text',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const publicationTypes = await payload.find({
    collection: 'publicationTypes',
    locale,
    sort: 'publicationType.text',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  // Prepare Publication Types and topics filter items
  // =========================
  const filterItemsPublicationTypes = prepareFilterItems({
    items: publicationTypes.docs,
    labelAll: rte1ToPlaintext(props.filterTitleAllPublications),
  });

  const filterItemsPublicationTopics = prepareFilterItems({
    items: publicationTopics.docs,
    labelAll: rte1ToPlaintext(props.filterTitleAllTopics),
  });

  // Aggregate Filter data
  // =========================
  const filterData = [
    filterItemsPublicationTypes,
    filterItemsPublicationTopics,
  ];

  // Get image ids of fetched publicationPages
  // =========================
  const publicationPagesImageIds = publicationPages.docs
    .map((p) => p.overviewPageProps?.image)
    .filter(Boolean);

  const uniqueImageIds = [...new Set(publicationPagesImageIds)];

  // Get all imageData
  // =========================
  const imageData = await getImageDataForUniqueIds(uniqueImageIds);

  const imagesById: Record<string, InterfaceImagePropTypes | undefined> = {};

  imageData.docs
    .forEach((img) => {
      const imageWithDefaults = {
        ...img,
        loading: 'lazy',
        variant: 'publicationTeaser',
      } as InterfaceImagePropTypes;

      imagesById[img.id] = imageWithDefaults;
    });

  const collectPublicationImages = (
    pages: typeof publicationPages.docs,
    imagesMap: Record<string, InterfaceImagePropTypes | undefined>,
  ): (InterfaceImagePropTypes)[] => pages.map((page) => {
    const imageId = page?.overviewPageProps?.image as string;

    return imagesMap[imageId] as InterfaceImagePropTypes;
  });

  const publicationImages = collectPublicationImages(
    publicationPages.docs,
    imagesById,
  );

  const title = rte1ToPlaintext(props.title);
  const notificationContent = rteToHtml(props.notification);

  // Prepare Publication items
  const items = convertPayloadPublicationsPagesToFeItems(
    publicationPages,
    publicationImages,
    publicationTypes.docs,
    filterItemsPublicationTypes,
    locale,
  );

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <PublicationsOverview
      colorMode='white'
      filterItems={filterData}
      notification={{
        text: notificationContent,
        title: '',
      }}
      paginationTitle='Pagination'
      publicationItems={items}
      title={title}
    />
  );
};
