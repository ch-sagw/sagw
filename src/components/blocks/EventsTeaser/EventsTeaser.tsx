import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { rteToHtml } from '@/utilities/rteToHtml';
import {
  Config,
  I18NGlobal,
  InterfaceEventsTeasersBlock,
} from '@/payload-types';
import { EventsTeaserComponent } from '@/components/blocks/EventsTeaser/EventsTeaser.component';
import { convertPayloadEventPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';

type InterfaceEventsTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
  globalI18n: I18NGlobal;
} & InterfaceEventsTeasersBlock;

export const EventsTeaser = async (props: InterfaceEventsTeaserPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  // Get events data
  const eventsPages = await payload.find({
    collection: 'eventDetailPage',
    depth: 1,
    limit: 3,
    locale: props.language,
    pagination: false,
    sort: '-eventDetails.date',
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

  const items = convertPayloadEventPagesToFeItems({
    globalI18n: props.globalI18n,
    lang: props.language,
    payloadPages: eventsPages,
  });

  return (

    <EventsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
      pageLanguage={props.language}
    />
  );

};
