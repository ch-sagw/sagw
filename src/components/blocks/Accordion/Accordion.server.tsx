import 'server-only';
import React from 'react';
import { InterfaceAccordionBlock } from '@/payload-types';
import { AccordionClient } from './Accordion.client';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import {
  rte4ToHtml, rteToHtml,
} from '@/utilities/rteToHtml';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceAccordionServerPropTypes = {} & InterfaceAccordionBlock;

export const Accordion = async ({
  accordions,
  title,
  colorMode,
}: InterfaceAccordionServerPropTypes): Promise<React.JSX.Element> => {
  const locale = (await getLocale()) as TypedLocale;
  const payload = await getPayloadCached();

  // Pre-render accordion content
  const accordionsWithHtml = await Promise.all(accordions.map(async (item) => {
    const contentHtml = await rte4ToHtml({
      content: item.accordionContent,
      locale,
      payload,
    });

    const titleHtml = rteToHtml(item.accordionTitle);

    return {
      accordionContentHtml: contentHtml,
      accordionTitle: titleHtml,
      id: item.id,
    };
  }));

  // Pre-render title
  const titleHtml = rteToHtml(title);

  return (
    <AccordionClient
      accordions={accordionsWithHtml}
      title={titleHtml}
      colorMode={colorMode}
    />
  );
};
