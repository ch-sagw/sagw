'use client';

import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Rte/Rte.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { ColorMode } from '@/components/base/types/colorMode';

export type InterfaceRteClientPropTypes = {
  className?: string;
  colorMode: ColorMode;
  stickyFirstTitle: boolean;
  textHtml: string;
};

export const RteClient = ({
  className,
  colorMode,
  stickyFirstTitle,
  textHtml,
}: InterfaceRteClientPropTypes): React.JSX.Element => {
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
    })}
    >
      <SafeHtml
        as='div'
        className={styles.text}
        html={textHtml}
      />
    </div>
  );
};

