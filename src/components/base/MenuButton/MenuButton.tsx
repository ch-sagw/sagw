'use client';

import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/MenuButton/MenuButton.module.scss';

export type InterfaceMenuButtonPropTypes = {
  onClick: () => void;
  open: boolean;
  className?: string;
  hiddenTexts: {
    openMenu: string;
    closeMenu: string;
  }
};

export const MenuButton = ({
  open,
  onClick,
  className,
  hiddenTexts,
}: InterfaceMenuButtonPropTypes): React.JSX.Element => {
  const classes = cva([
    styles.button,
    className,
  ], {
    variants: {
      open: {
        false: undefined,
        true: styles.open,
      },
    },
  });

  return (
    <button
      className={classes({
        open,
      })}
      onClick={onClick}
      aria-label={open
        ? hiddenTexts.closeMenu
        : hiddenTexts.openMenu
      }
    >
      <span className={styles.dash1} />
      <span className={styles.dash2} />
      <span className={styles.dash3} />
    </button>
  );
};
