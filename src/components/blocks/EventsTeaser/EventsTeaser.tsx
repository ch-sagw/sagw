import 'server-only';
import React, { Fragment } from 'react';
import { rteToHtml } from '@/utilities/rteToHtml';
import {
  I18NGlobal,
  InterfaceEventsTeasersBlock,
} from '@/payload-types';
import { EventsTeaserComponent } from '@/components/blocks/EventsTeaser/EventsTeaser.component';
import { convertPayloadEventPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { fetchEventDetailPages } from '@/data/fetch';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from '@/utilities/getPayloadCached';

type InterfaceEventsTeaserPropTypes = {
  tenant: string;
  globalI18n: I18NGlobal;
  projectId?: string;
} & InterfaceEventsTeasersBlock;

export const EventsTeaser = async (props: InterfaceEventsTeaserPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    projectId,
  } = props;
  const pages = await fetchEventDetailPages({
    language: locale,
    limit: 3,
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
        payload: await getPayloadCached(),
      }),

      text: rteToHtml(props.optionalLink.link.linkText),
    };
  }

  const items = await convertPayloadEventPagesToFeItems({
    globalI18n: props.globalI18n,
    lang: locale,
    payloadPages: pages,
  });

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (

    <EventsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
    />
  );

};
