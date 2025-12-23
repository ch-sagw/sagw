import 'server-only';
import React, { Fragment } from 'react';
import {
  TypedLocale, Where,
} from 'payload';

import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfaceNewsTeasersBlock } from '@/payload-types';
import { NewsTeaserComponent } from '@/components/blocks/NewsTeaser/NewsTeaser.component';
import { convertPayloadNewsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { InterfaceSourcePage } from '@/app/(frontend)/renderers/RenderBlocks';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getPageUrl } from '@/utilities/getPageUrl';

type InterfaceNewsTeaserPropTypes = {
  tenant: string;
  sourcePage: InterfaceSourcePage
} & InterfaceNewsTeasersBlock;

export const NewsTeaser = async (props: InterfaceNewsTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();

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
    locale,
    pagination: false,
    sort: '-hero.date',
    where: queryRestraints,
  });

  const title = rteToHtml(props.title);
  let allLink;

  if (props.optionalLink?.includeLink && props.optionalLink.link?.linkText) {
    allLink = {

      // TODO: we need reference tracking here
      href: await getPageUrl({
        locale,
        pageId: props.optionalLink.link.internalLink.documentId,
        payload,
      }),

      text: rteToHtml(props.optionalLink.link?.linkText),
    };
  }

  const items = await convertPayloadNewsPagesToFeItems(newsPages, locale);

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (

    <NewsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
      colorMode={props.colorMode}
    />
  );

};
