import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Tag/Tag.module.scss';

export type InterfaceTagPropTypes = {
  text: string;
  colorTheme: 'primary' | 'secondary';
  className?: string;
};

export const Tag = ({
  text,
  colorTheme,
  className,
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
    },
  });

  return (
    <span
      className={classes({
        colorTheme,
      })}
    >{text}</span>
  );
};
