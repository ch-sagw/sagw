import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Tag/Tag.module.scss';
import { SafeHtml } from '../SafeHtml/SafeHtml';

export type InterfaceTagPropTypes = {
  text: string;
  colorTheme: 'primary' | 'secondary';
  className?: string;
  large?: boolean;
};

export const Tag = ({
  text,
  colorTheme,
  className,
  large,
}: InterfaceTagPropTypes): React.JSX.Element => {
  const classes = cva([
    styles.tag,
    className,
  ], {
    variants: {
      colorTheme: {
        primary: [styles.primary],
        secondary: [styles.secondary],
      },
      large: {
        false: undefined,
        true: [styles.large],
      },
    },
  });

  return (
    <SafeHtml
      as='span'
      className={classes({
        colorTheme,
        large,
      })}
      html={text}

    />
  );
};
