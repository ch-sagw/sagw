import 'server-only';
import React, { Fragment } from 'react';
import { rteToHtml } from '@/utilities/rteToHtml';
import {
  InterfacePublicationsTeasersBlock,
  PublicationDetailPage,
} from '@/payload-types';
import { fetchPublicationPages } from '@/data/fetch';
import { PublicationsTeaserComponent } from '@/components/blocks/PublicationsTeaser/PublicationsTeaser.component';
import { convertPayloadPublicationsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { prerenderPageLinks } from '@/utilities/prerenderPageLinks';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { InterfaceSourcePage } from '@/app/(frontend)/renderers/RenderBlocks';

export type InterfacePublicationsTeaserPropTypes = {
  tenant: string;
  projectId?: string;
  sourcePage?: InterfaceSourcePage;
} & InterfacePublicationsTeasersBlock;

export const PublicationsTeaser = async (props: InterfacePublicationsTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    tenant,
    projectId,
  } = props;

  let excludePageId;
  let publicationTopicId;

  if (props.sourcePage?.collectionSlug === 'publicationDetailPage') {
    excludePageId = props.sourcePage.id;
    publicationTopicId = props.sourcePage.categorization?.topicId;
  }

  const pages = await fetchPublicationPages({
    depth: 2,
    excludePageId,
    limit: 4,
    locale,
    projectId,
    publicationTopicId,
    sort: '-overviewPageProps.date',
    tenant,
  }) as PublicationDetailPage[];

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

  const title = rte1ToPlaintext(props.title);

  let allLink;

  if (props.optionalLink?.includeLink && props.optionalLink.link?.linkText) {
    allLink = {
      href: await getPageUrl({
        alternateLocaleForMissingPath: true,
        locale,
        pageId: props.optionalLink.link.internalLink.documentId,
        payload: await getPayloadCached(),
      }),

      text: rteToHtml(props.optionalLink.link.linkText),
    };
  }

  // Convert publication detail pages to
  // publication teaser items
  const items = convertPayloadPublicationsPagesToFeItems({
    lang: locale,
    payloadPages: pages,
    publicationTypes: publicationTypes.docs,
    urlMap,
  });

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <PublicationsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
    />
  );
};
