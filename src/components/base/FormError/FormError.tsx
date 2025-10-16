import React from 'react';
import styles from '@/components/base/FormError/FormError.module.scss';
import { Icon } from '@/icons';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { cva } from 'cva';
import { ColorMode } from '@/components/base/types/colorMode';

export type InterfaceFormErrorPropTypes = {
  colorMode: ColorMode
  errorId: string;
  errorText: string;
  className?: string;
};

export const FormError = ({
  errorId,
  errorText,
  className,
  colorMode,
}: InterfaceFormErrorPropTypes): React.JSX.Element => {
  const classes = cva([
    styles.error,
    className,
  ], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        light: null,
        white: null,
      },
    },
  });

  return (
    <span
      className={classes({
        colorMode,
      })}
      id={errorId}
    >
      <Icon
        name='warning'
        className={styles.icon}
      />
      <SafeHtml
        as='span'
        html={errorText}
      />
    </span>
  );
};
