
import React, { Fragment } from 'react';
import configPromise from '@/payload.config';

import { PublicationsOverviewComponent } from '@/components/blocks/PublicationsOverview/PublicationsOverview.component';
import { InterfacePublicationsOverviewBlock } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import {
  convertPayloadPublicationsPagesToFeItems,
  prepareFilterItems,
} from '@/components/blocks/helpers/dataTransformers';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';
import { InterfaceFilterListPropTypes } from '@/components/base/FilterList/FilterList';
import {
  getLocale,
  getTranslations,
} from 'next-intl/server';
import {
  getPayload,
  TypedLocale,
} from 'payload';
import { getImageDataForUniqueIds } from '@/components/blocks/helpers/getImageData';

type InterfaceNewsOverviewPropTypes = {
  tenant: string;
} & InterfacePublicationsOverviewBlock;

export const PublicationsOverview = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const locale = (await getLocale()) as TypedLocale;

  const i18nPublicationFilters = await getTranslations('publicationFilters');

  console.log(i18nPublicationFilters('publicationTypesLabel'));

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

  const publications = publicationPages.docs;

  // Get image ids of fetched publicationPages
  // =========================
  const publicationPagesImageIds = publications
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
    pages: typeof publications,
    imagesMap: Record<string, InterfaceImagePropTypes | undefined>,
  ): (InterfaceImagePropTypes)[] => pages.map((page) => {
    const imageId = page?.overviewPageProps?.image as string;

    return imagesMap[imageId] as InterfaceImagePropTypes;
  });

  const publicationImages = collectPublicationImages(publications, imagesById);

  const title = rteToHtml(props.title);

  // Prepare Publication items
  // =========================
  const items = convertPayloadPublicationsPagesToFeItems(publicationPages, publicationImages, locale);

  // Prepare Publication Types filter items
  // =========================
  const filterTitlesPublicationTypes = prepareFilterItems({
    items: publicationTypes.docs,
    labelAll: i18nPublicationFilters('publicationTopicsLabel'),
  });

  // Prepare Publication Topics filter items
  // =========================
  const filterTitlesPublicationTopics = prepareFilterItems({
    items: publicationTopics.docs,
    labelAll: i18nPublicationFilters('publicationTypesLabel'),
  });

  const filters: InterfaceFilterListPropTypes = {
    filterListItems: [
      {
        filterItems: filterTitlesPublicationTypes,
        labelText: i18nPublicationFilters('publicationTopicsLabel'),
        name: 'publication-topics',
        type: 'staticSelect',
      },
      {
        filterItems: filterTitlesPublicationTopics,
        labelText: i18nPublicationFilters('publicationTypesLabel'),
        name: 'publication-types',
        type: 'staticSelect',
      },
    ],
  };

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <PublicationsOverviewComponent
      colorMode='white'
      items={items}
      filters={filters}
      notification={{
        text: 'Das ist ein Test',
        title: '',
      }}
      paginationTitle='Pagination'
      title={title}
    />
  );
};
