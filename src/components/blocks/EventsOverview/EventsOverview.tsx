import React, { Fragment } from 'react';
import { EventsOverviewComponent } from '@/components/blocks/EventsOverview/EventsOverview.component';
import {
  Config, I18NGlobal, InterfaceEventsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { convertPayloadEventPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { fetchEventDetailPages } from '@/data/fetch';

export type InterfaceEventsOverviewPropTypes = {
  language: Config['locale'];
  tenant: string;
  globalI18n: I18NGlobal;
} & InterfaceEventsOverviewBlock;

export const EventsOverview = async (props: InterfaceEventsOverviewPropTypes): Promise<React.JSX.Element> => {
  const title = rteToHtml(props.title);
  const pages = await fetchEventDetailPages({
    language: props.language,
    limit: 0,
    tenant: props.tenant,
  });

  const items = convertPayloadEventPagesToFeItems({
    globalI18n: props.globalI18n,
    lang: props.language,
    payloadPages: pages,
  });

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

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
