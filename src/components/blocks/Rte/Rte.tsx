import 'server-only';
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Rte/Rte.module.scss';
import { InterfaceRte } from '@/components/base/types/rte';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rte4ToHtml } from '@/utilities/rteToHtml';
import { ColorMode } from '@/components/base/types/colorMode';
import { getLocale } from 'next-intl/server';
import type { Config } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';

// We explicitly don't take InterfaceTextBlock, since we want explicit
// rte typing here
export type InterfaceRtePropTypes = {
  colorMode: ColorMode,
  text: InterfaceRte,
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
  const html = await rte4ToHtml({
    content: text,
    locale,
    payload,
  });

  const classes = cva([
    styles.rte,
    className,
  ], {
    variants: {
      colorMode: {
        dark: styles.dark,
        light: styles.light,
        white: styles.white,
      },
      stickyFirstTitle: {
        false: undefined,
        true: styles.stickyFirstTitle,
      },
    },
  });

  return (
    <div className={classes({
      colorMode,
      stickyFirstTitle,
    })
    } >
      <SafeHtml
        as='div'
        html={html}
        className={styles.text}
      />
    </div >
  );
};
