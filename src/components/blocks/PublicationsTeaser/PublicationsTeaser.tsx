import React, { Fragment } from 'react';
import {
  getPayload,
  TypedLocale,
} from 'payload';
import configPromise from '@/payload.config';
import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfacePublicationsTeasersBlock } from '@/payload-types';
import { PublicationsTeaserComponent } from '@/components/blocks/PublicationsTeaser/PublicationsTeaser.component';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';
import { convertPayloadPublicationsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { getLocale } from 'next-intl/server';
import { getImageDataForUniqueIds } from '@/components/blocks/helpers/getImageData';

export type InterfacePublicationsTeaserPropTypes = {
  tenant: string;
} & InterfacePublicationsTeasersBlock;

export const PublicationsTeaser = async (props: InterfacePublicationsTeaserPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const locale = (await getLocale()) as TypedLocale;

  // Get publications data
  const publicationPages = await payload.find({
    collection: 'publicationDetailPage',
    depth: 1,
    limit: 4,
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

  const publications = publicationPages.docs;

  // Get image ids of fetched publicationPages
  const publicationPagesImageIds = publications
    .map((p) => p.overviewPageProps?.image)
    .filter(Boolean);

  const uniqueImageIds = [...new Set(publicationPagesImageIds)];

  // Get all imageData
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
  let allLink;

  if (props.optionalLink?.includeLink && props.optionalLink.link?.linkText) {
    allLink = {

      // TODO
      href: '/overview',

      text: rteToHtml(props.optionalLink.link?.linkText),
    };
  }

  const items = convertPayloadPublicationsPagesToFeItems(publicationPages, publicationImages, locale);

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
