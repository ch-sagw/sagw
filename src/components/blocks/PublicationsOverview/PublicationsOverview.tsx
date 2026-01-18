import 'server-only';
import React from 'react';
import { PublicationsOverview } from '@/components/blocks/PublicationsOverview/PublicationsOverview.component';
import {
  InterfacePublicationsOverviewBlock,
  PublicationDetailPage,
} from '@/payload-types';
import { fetchDetailPages } from '@/data/fetch';
import {
  convertPayloadPublicationsPagesToFeItems,
  prepareFilterItems,
} from '@/components/blocks/helpers/dataTransformers';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

type InterfaceNewsOverviewPropTypes = {
  tenant: string;
} & InterfacePublicationsOverviewBlock;

export const PublicationsOverviewBlock = async (props: InterfaceNewsOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
  } = props;

  const pages = await fetchDetailPages({
    collection: 'publicationDetailPage',
    depth: 2,
    language: locale,
    limit: 0,
    sort: '-createdAt',
    tenant,
  }) as PublicationDetailPage[];

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

  const urlMap = await prerenderPageLinks({
    locale,
    pages,
    payload,
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

  const title = rte1ToPlaintext(props.title);

  // Convert publication detail pages to
  // publication teaser items
  const items = convertPayloadPublicationsPagesToFeItems(
    pages,
    urlMap,
    publicationTypes.docs,
    locale,
  );

  return (
    <PublicationsOverview
      colorMode='white'
      filterItems={filterData}
      paginationTitle='Pagination'
      publicationItems={items}
      title={title}
    />
  );
};
