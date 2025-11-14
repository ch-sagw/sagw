import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { rteToHtml } from '@/utilities/rteToHtml';
import {
  Config,
  InterfacePublicationsTeasersBlock,
} from '@/payload-types';
import { PublicationsTeaserComponent } from '@/components/blocks/PublicationsTeaser/PublicationsTeaser.component';
import { convertPayloadPublicationPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';

export type InterfacePublicationsTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfacePublicationsTeasersBlock;

export const PublicationsTeaser = async (props: InterfacePublicationsTeaserPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  // Get publications data
  const publicationPages = await payload.find({
    collection: 'publicationDetailPage',
    depth: 1,
    limit: 4,
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

  const title = rteToHtml(props.title);
  let allLink;

  if (props.link === 'yes' && props.linkText) {
    allLink = {

      // TODO
      href: '/overview',

      text: rteToHtml(props.linkText),
    };
  }

  const items = convertPayloadPublicationPagesToFeItems(publicationPages, props.language);

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <PublicationsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
      pageLanguage={props.language}
    />
  );
};
