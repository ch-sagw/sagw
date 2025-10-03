'use client';

import React from 'react';
import { cva } from 'cva';
import { ColorMode } from '@/components/base/types/colorMode';
import styles from '@/components/base/MenuButton/MenuButton.module.scss';

export type InterfaceMenuButtonPropTypes = {
  onClick: () => void;
  open: boolean;
  hiddenTexts: {
    openMenu: string;
    closeMenu: string;
  },
  className?: string;
  colorMode: ColorMode;
};

export const MenuButton = ({
  open,
  onClick,
  hiddenTexts,
  className,
  colorMode,
}: InterfaceMenuButtonPropTypes): React.JSX.Element => {
  const classes = cva([
    styles.button,
    className,
    styles[colorMode],
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
      data-testid='menuButton'
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
