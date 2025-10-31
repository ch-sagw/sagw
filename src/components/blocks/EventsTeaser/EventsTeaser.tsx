import React, { Fragment } from 'react';
import { rteToHtml } from '@/utilities/rteToHtml';
import {
  Config,
  I18NGlobal,
  InterfaceEventsTeasersBlock,
} from '@/payload-types';
import { EventsTeaserComponent } from '@/components/blocks/EventsTeaser/EventsTeaser.component';
import { convertPayloadEventPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { fetchEventDetailPages } from '@/data/fetch';

type InterfaceEventsTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
  globalI18n: I18NGlobal;
} & InterfaceEventsTeasersBlock;

export const EventsTeaser = async (props: InterfaceEventsTeaserPropTypes): Promise<React.JSX.Element> => {
  const pages = await fetchEventDetailPages({
    language: props.language,
    limit: 3,
    tenant: props.tenant,
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

  const items = convertPayloadEventPagesToFeItems({
    globalI18n: props.globalI18n,
    lang: props.language,
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
      pageLanguage={props.language}
    />
  );

};
