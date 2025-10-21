import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { rteToHtml } from '@/utilities/rteToHtml';
import {
  Config,
  InterfaceEventsTeasersBlock,
} from '@/payload-types';
import { EventsTeaserComponent } from '@/components/blocks/EventsTeaser/EventsTeaser.component';
import { convertPayloadEventPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';

type InterfaceEventsTeaserPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceEventsTeasersBlock;

export const EventsTeaser = async (props: InterfaceEventsTeaserPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayload({
    config: configPromise,
  });

  // Get events data
  const eventsPages = await payload.find({
    // TODO: get latest sorted by date

    collection: 'eventDetailPage',
    depth: 1,

    // TODO: how many?
    limit: 4,

    locale: props.language,
    overrideAccess: false,
    pagination: false,
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

  const items = convertPayloadEventPagesToFeItems(eventsPages, props.language);

  return (

    <EventsTeaserComponent
      title={title}
      allLink={allLink}
      items={items}
    />
  );

};
