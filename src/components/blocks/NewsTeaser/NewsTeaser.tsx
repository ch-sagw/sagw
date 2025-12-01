import React, { Fragment } from 'react';
import {
  getPayload, Where,
} from 'payload';
import configPromise from '@/payload.config';

import { rteToHtml } from '@/utilities/rteToHtml';
import {
  Config,
  InterfaceNewsTeasersBlock,
} from '@/payload-types';
import { NewsTeaserComponent } from '@/components/blocks/NewsTeaser/NewsTeaser.component';
import { convertPayloadNewsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { InterfaceSourcePage } from '@/app/(frontend)/RenderBlocks';

type InterfaceNewsTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
  sourcePage: InterfaceSourcePage
} & InterfaceNewsTeasersBlock;

export const NewsTeaser = async (props: InterfaceNewsTeaserPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const queryRestraints: Where = {
    tenant: {
      equals: props.tenant,
    },
  };

  // on news pages, don't show the teaser which points to current
  // page
  if (props.sourcePage.collectionSlug === 'newsDetailPage') {
    queryRestraints.id = {
      /* eslint-disable @typescript-eslint/naming-convention */
      not_equals: props.sourcePage.id,
      /* eslint-enable @typescript-eslint/naming-convention */
    };
  }

  // Get news data
  const newsPages = await payload.find({
    collection: 'newsDetailPage',
    depth: 1,
    limit: 3,
    locale: props.language,
    pagination: false,
    sort: '-hero.date',
    where: queryRestraints,
  });

  const title = rteToHtml(props.title);
  let allLink;

  if (props.optionalLink?.includeLink && props.optionalLink.link?.linkText) {
    allLink = {

      // TODO
      href: '/overview',

      text: rteToHtml(props.optionalLink.link?.linkText),
    };
  }

  const items = convertPayloadNewsPagesToFeItems(newsPages, props.language);

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (

    <NewsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
      pageLanguage={props.language}
      colorMode={props.colorMode}
    />
  );

};
