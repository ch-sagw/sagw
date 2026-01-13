import 'server-only';
import React from 'react';
import {
  type Config, InterfaceFootnotesBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { FootnoteClient } from './Footnote.client';

export type InterfaceFootnotePropTypes = {} & InterfaceFootnotesBlock;

export const Footnote = async ({
  title,
  text,
}: InterfaceFootnotePropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as Config['locale'];
  const textHtml = await rte3ToHtml({
    content: text,
    locale,
    payload,
  });
  const titleHtml = rteToHtml(title);

  return (
    <FootnoteClient
      textHtml={textHtml}
      titleHtml={titleHtml}
    />
  );
};
