import React, { Fragment } from 'react';
import { EventsOverviewComponent } from '@/components/blocks/EventsOverview/EventsOverview.component';
import {
  I18NGlobal, InterfaceEventsOverviewBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { convertPayloadEventPagesToFeItems } from '@/components/blocks/helpers/dataTransformers';
import { fetchEventDetailPages } from '@/data/fetch';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfaceEventsOverviewPropTypes = {
  tenant: string;
  globalI18n: I18NGlobal;
} & InterfaceEventsOverviewBlock;

export const EventsOverview = async (props: InterfaceEventsOverviewPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const title = rteToHtml(props.title);
  const pages = await fetchEventDetailPages({
    language: locale,
    limit: 0,
    tenant: props.tenant,
  });

  const items = convertPayloadEventPagesToFeItems({
    globalI18n: props.globalI18n,
    lang: locale,
    payloadPages: pages,
  });

  if (!items || items.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <EventsOverviewComponent
      title={title}
      colorMode='white'
      items={items}
    />
  );
};
