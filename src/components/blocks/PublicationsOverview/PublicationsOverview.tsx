import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { PublicationsOverviewComponent } from '@/components/blocks/PublicationsOverview/PublicationsOverview.component';
import {
  Config, InterfacePublicationsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import {
  convertPayloadPublicationsPagesToFeItems,
  preparePublicationTopicsFilterItems,
  preparePublicationTypesFilterItems,
} from '@/components/blocks/helpers/dataTransformers';
import { i18nPublicationFilters } from '@/i18n/content';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';

import { InterfaceFilterListPropTypes } from '@/components/base/FilterList/FilterList';

type InterfaceNewsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfacePublicationsOverviewBlock;

const preparePublicationsOverviewFilters = ({
  language,
  topics,
  types,
}: {
  language: string;
  topics: any;
  types: any;
}): InterfaceFilterListPropTypes => {
  const topicItems = topics.map((topic: string) => ({
    checked: false,
    label: topic,
    value: topic.toLowerCase()
      .replace(/\s+/gu, '-'),
  }));

  const typeItems = types.map((type: string) => ({
    checked: false,
    label: type,
    value: type.toLowerCase()
      .replace(/\s+/gu, '-'),
  }));

  const filters: InterfaceFilterListPropTypes = {
    filterListItems: [
      {
        filterItems: topicItems,
        labelText: i18nPublicationFilters.publicationTopicsLabel[language as keyof typeof i18nPublicationFilters.publicationTopicsLabel],
        name: 'publication-topics',
        type: 'staticSelect',
      },
      {
        filterItems: typeItems,
        labelText: i18nPublicationFilters.publicationTypesLabel[language as keyof typeof i18nPublicationFilters.publicationTypesLabel],
        name: 'publication-types',
        type: 'staticSelect',
      },
    ],
  };

  return filters;
};

export const PublicationsOverview = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {

  const payload = await getPayload({
    config: configPromise,
  });

  // Get publication detail pages data
  const publicationPages = await payload.find({
    collection: 'publicationDetailPage',
    depth: 1,
    limit: 0,
    locale: props.language,
    overrideAccess: false,
    pagination: false,
    sort: '-overviewPageProps.date',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const publications = publicationPages.docs;

  // Get image ids of fetched publicationPages
  const publicationPagesImageIds = publications
    .map((p) => p.overviewPageProps?.image)
    .filter(Boolean);

  const uniqueImageIds = [...new Set(publicationPagesImageIds)];

  // Get all imageData
  const imageData = await payload.find({
    collection: 'images',
    limit: uniqueImageIds.length,
    where: {
      id: {
        in: uniqueImageIds,
      },
    },
  });

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

  const publicationTypes = await payload.find({
    collection: 'publicationTypes',
    locale: props.language,
    sort: 'publicationType.text',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const publicationTopics = await payload.find({
    collection: 'publicationTopics',
    locale: props.language,
    sort: 'publicationTopic.text',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);

  // Prepare Publication items
  const items = convertPayloadPublicationsPagesToFeItems(publicationPages, publicationImages, props.language);

  // Prepare Publication Types filter items
  const filterTitleAllTypes = rte1ToPlaintext(props.filterTitleAllPublications);
  const filterTitlesPublicationTypes = preparePublicationTypesFilterItems(publicationTypes);

  filterTitlesPublicationTypes.unshift(filterTitleAllTypes);

  // Prepare Publication Topics filter items
  const filterTitleAllTopics = rte1ToPlaintext(props.filterTitleAllTopics);
  const filterTitlesPublicationTopics = preparePublicationTopicsFilterItems(publicationTopics);

  filterTitlesPublicationTopics.unshift(filterTitleAllTopics);

  const filters = preparePublicationsOverviewFilters({
    language: props.language,
    topics: filterTitlesPublicationTopics,
    types: filterTitlesPublicationTypes,
  });

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <PublicationsOverviewComponent
      colorMode='white'
      filters={filters}
      items={items}
      notification={{
        text: 'Das ist ein Test',
        title: '',
      }}
      paginationTitle='Pagination'
      title={title}
    />
  );
};
