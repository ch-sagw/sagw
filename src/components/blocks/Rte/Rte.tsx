import 'server-only';
import React from 'react';
import { InterfaceRte } from '@/components/base/types/rte';
import { rte4ToHtml } from '@/utilities/rteToHtml.server';
import { ColorMode } from '@/components/base/types/colorMode';
import { getLocale } from 'next-intl/server';
import type { Config } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { RteClient } from './Rte.client';

// We explicitly don't take InterfaceTextBlock, since we want explicit
// rte typing here
export type InterfaceRtePropTypes = {
  colorMode: ColorMode;
  text: InterfaceRte;
  stickyFirstTitle: boolean;
  className?: string;
};

export const Rte = async ({
  colorMode,
  text,
  stickyFirstTitle,
  className,
}: InterfaceRtePropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const locale = (await getLocale()) as Config['locale'];
  const textHtml = await rte4ToHtml({
    content: text,
    locale,
    payload,
  });

  return (
    <RteClient
      className={className}
      colorMode={colorMode}
      stickyFirstTitle={stickyFirstTitle}
      textHtml={textHtml}
    />
  );
};
