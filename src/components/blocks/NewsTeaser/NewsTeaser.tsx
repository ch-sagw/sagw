import 'server-only';
import React, { Fragment } from 'react';
import { TypedLocale } from 'payload';
import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfaceNewsTeasersBlock } from '@/payload-types';
import { NewsTeaserComponent } from '@/components/blocks/NewsTeaser/NewsTeaser.component';
import { convertPayloadNewsPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { InterfaceSourcePage } from '@/app/(frontend)/renderers/RenderBlocks';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getPageUrl } from '@/utilities/getPageUrl';
import { fetchNewsTeaserPages } from '@/data/fetch';

type InterfaceNewsTeaserPropTypes = {
  tenant: string;
  sourcePage: InterfaceSourcePage;
  projectId?: string;
} & InterfaceNewsTeasersBlock;

export const NewsTeaser = async (props: InterfaceNewsTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();
  const {
    projectId,
  } = props;

  const excludePageId = props.sourcePage.collectionSlug === 'newsDetailPage'
    ? props.sourcePage.id
    : undefined;

  // Get news data
  const newsPages = await fetchNewsTeaserPages({
    excludePageId,
    locale,
    project: projectId,
    tenant: props.tenant,
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
