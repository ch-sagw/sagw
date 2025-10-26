import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import { EventsOverviewComponent } from '@/components/blocks/EventsOverview/EventsOverview.component';
import {
  Config, I18NGlobal, InterfaceEventsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { convertPayloadEventPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';

export type InterfaceEventsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
  globalI18n: I18NGlobal;
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
    sort: '-eventDetails.date',
    where: {
      tenant: {
        equals: props.tenant,
      },
    },
  });

  const title = rteToHtml(props.title);

  const items = convertPayloadEventPagesToFeItems({
    globalI18n: props.globalI18n,
    lang: props.language,
    payloadPages: eventPages,
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
