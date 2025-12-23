import 'server-only';
import React from 'react';
import {
  type Config, InterfaceBibliographicReferenceBlock,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import { InterfaceRte } from '@/components/base/types/rte';
import { BibliographicReferenceClient } from './BibliographicReference.client';
import { getLocale } from 'next-intl/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export type InterfaceBibliographicReferencePropTypes = {
  title: InterfaceRte;
  buttonText: InterfaceRte;
} & InterfaceBibliographicReferenceBlock;

export const BibliographicReference = async ({
  title,
  text,
  buttonText,
}: InterfaceBibliographicReferencePropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as Config['locale'];
  const textHtml = await rte3ToHtml({
    content: text,
    locale,
    payload,
  });
  const titleHtml = rteToHtml(title);

  return (
    <BibliographicReferenceClient
      buttonText={buttonText}
      textHtml={textHtml}
      titleHtml={titleHtml}
    />
  );
};
