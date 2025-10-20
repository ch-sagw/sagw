import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { EventsOverviewComponent } from '@/components/blocks/EventsOverview/EventsOverview.component';
import { InterfaceEventsListItemPropTypes } from '@/components/base/EventsListItem/EventsListItem';
import {
  Config, EventCategory, InterfaceEventsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceEventsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
} & InterfaceEventsOverviewBlock;

export const EventsOverview = async (props: InterfaceEventsOverviewPropTypes): Promise<React.JSX.Element> => {

  const payload = await getPayload({
    config: configPromise,
  });

  // Get event pages data
  const eventPages = await payload.find({
    collection: 'eventDetailPage',

    // important, to get eventCategory, not just the id
    depth: 1,
    limit: 0,
    locale: props.language,
    pagination: false,
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);

  const items = eventPages.docs.map((eventPage) => {
    const category = eventPage.eventDetails.category as EventCategory;

    // if page has a detail page
    let link = `/${eventPage.slug}`;

    // if page has no detail page
    if (eventPage.showDetailPage === 'false') {
      link = eventPage.link?.externalLink || '';
    }

    const returnEventPage: InterfaceEventsListItemPropTypes = {
      dateEnd: eventPage.eventDetails.dateEnd || eventPage.eventDetails.date,
      dateStart: eventPage.eventDetails.date,
      language: rteToHtml(eventPage.eventDetails.language),
      link: {
        href: link,
        target: eventPage.showDetailPage === 'true'
          ? '_self' as const
          : '_blank' as const,
      },
      location: rteToHtml(eventPage.eventDetails.location),
      pageLanguage: props.language,
      tag: rteToHtml(category.eventCategory),
      text: rteToHtml(eventPage.eventDetails.title),
      time: rteToHtml(eventPage.eventDetails.time),
    };

    return returnEventPage;
  });

  return (
    <EventsOverviewComponent
      title={title}

      // TODO
      paginationTitle='Pagination'

      colorMode='white'
      items={items}
    />
  );
};
