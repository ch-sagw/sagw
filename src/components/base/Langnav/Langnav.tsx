'use client';

import React from 'react';
import { cva } from 'cva';
import { Button } from '@/components/base/Button/Button';
import styles from '@/components/base/Langnav/Langnav.module.scss';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useExpandOnHover } from '@/hooks/useExpandOnHover';

// --- Interfaces

export type InterfaceLangnavItem = {
  text: string;
  shortText: string;
  value: string;
}

export type InterfaceLangnavPropTypes = {
  items: InterfaceLangnavItem[];
  className?: string;
  onLangSelect: () => void;
  currentLang: string;
};

// --- Classes

const listClasses = cva([styles.list], {
  variants: {
    menuVisible: {
      false: null,
      true: [styles.visible],
    },
    nonExpandableMenu: {
      false: null,
      true: [styles.nonExpandable],
    },
  },
});

// --- Component

export const Langnav = ({
  items,
  className,
  onLangSelect,
  currentLang,
}: InterfaceLangnavPropTypes): React.JSX.Element => {

  // --- Hooks

  const {
    menuVisible,
    toggleButtonAutofocus,
    onToggleClick,
    onMouseEnter,
    onMouseLeave,
  } = useExpandOnHover();

  const breakpoint = useBreakpoint();

  const nonExpandableMenu: boolean =
    breakpoint === 'zero' ||
    breakpoint === 'micro' ||
    breakpoint === 'small' ||
    breakpoint === 'medium';

  // --- Helpers

  const getCurrentLang = (): InterfaceLangnavItem => {
    const langObj = items.filter((item) => item.value === currentLang);

    return langObj.length === 1
      ? langObj[0]
      : items[0];
  };

  // --- Render

  return (
    <div
      className={cva([
        styles.expandableMenu,
        className,
      ])()}
      onMouseEnter={nonExpandableMenu
        ? undefined
        : onMouseEnter}
      onMouseLeave={nonExpandableMenu
        ? undefined
        : onMouseLeave}
    >
      {!nonExpandableMenu && (
        <Button
          onClick={onToggleClick}
          className={styles.toggle}
          text={getCurrentLang().shortText}
          style='text'
          colorMode='dark'
          element='button'
          ariaExpanded={menuVisible}
          autoFocus={toggleButtonAutofocus}
        />
      )}

      <ul
        className={listClasses({
          menuVisible: nonExpandableMenu || menuVisible,
          nonExpandableMenu,
        })}
        inert={!nonExpandableMenu && !menuVisible}
      >
        <div className={styles.listWrapper}>
          {items.map((item, key: number) => (
            <li key={key}>
              <Button
                onClick={() => {
                  onLangSelect();
                }}
                className={styles.item}
                text={nonExpandableMenu
                  ? item.shortText
                  : item.text}
                style='text'
                colorMode='dark'
                element='button'
                disabled={!nonExpandableMenu && item.value === currentLang}
                ariaCurrent={
                  item.value === currentLang && nonExpandableMenu
                    ? true
                    : undefined
                }
              />
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};
