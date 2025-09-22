'use client';

import React, { useState } from 'react';
import { cva } from 'cva';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import styles from '@/components/base/Langnav/Langnav.module.scss';

export type InterfaceLangnavPropTypes = {
  items: string[];
  className?: string;
  onLangSelect: () => void;
  currentLang: string;
};

export const Langnav = ({
  items,
  className,
  onLangSelect,
  currentLang,
}: InterfaceLangnavPropTypes): React.JSX.Element => {

  // --- Hoooks

  const isTouchDevice = useIsTouchDevice();

  // --- State

  const [
    menuVisible,
    setMenuVisible,
  ] = useState(false);

  // --- Classes

  const classes = cva([
    styles.langnav,
    className,
  ], {
    variants: {
      menuVisible: {
        true: [styles.visible],
        white: null,
      },
    },
  });

  // --- Event Handlers

  const onClick = (): void => {
    if (!isTouchDevice) {
      return;
    }

    setMenuVisible(!menuVisible);
  };

  const onMouseEnter = (): void => {
    if (isTouchDevice) {
      return;
    }

    setMenuVisible(true);
  };

  const onMouseLeave = (): void => {
    if (isTouchDevice) {
      return;
    }

    setMenuVisible(false);
  };

  // --- Render

  return (
    <div
      className={classes({
        menuVisible,
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={onClick}

      >{currentLang}</button>

      <ul
        className={styles.list}
        aria-hidden={menuVisible}
      >
        {items.map((item, key: number) => (
          <li
            key={key}
          >
            <button onClick={onLangSelect}>{item}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
