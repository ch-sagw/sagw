'use client';

import React, {
  useEffect, useRef,
} from 'react';
import { cva } from 'cva';
import { Button } from '@/components/base/Button/Button';
import styles from '@/components/base/Langnav/Langnav.module.scss';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useExpandOnHover } from '@/hooks/useExpandOnHover';
import { ColorMode } from '@/components/base/types/colorMode';
import { measureElementHeight } from '@/components/helpers/elementHeight';

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
  colorMode: ColorMode;
  visibilityCallback?: (visible: boolean) => void;
  onHeightChange?: (height: number) => void;
  title: string;
  description: string;
};

// --- Classes

const listClasses = cva([styles.listWrapper], {
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
  colorMode,
  visibilityCallback,
  onHeightChange,
  description,
  title,
}: InterfaceLangnavPropTypes): React.JSX.Element => {

  // -- Refs
  const rootRef = useRef<HTMLDivElement>(null);
  const expandableRef = useRef<HTMLDivElement>(null);

  // --- Hooks

  const {
    menuVisible,
    toggleButtonAutofocus,
    onToggleClick,
    onMouseEnter,
    onMouseLeave,
    handleBlur,
  } = useExpandOnHover();

  const breakpoint = useBreakpoint();

  const nonExpandableMenu: boolean =
    breakpoint === 'zero' ||
    breakpoint === 'micro' ||
    breakpoint === 'small' ||
    breakpoint === 'medium';

  // --- Effects
  useEffect(() => {
    if (visibilityCallback) {
      visibilityCallback(menuVisible);
    }
  }, [
    menuVisible,
    visibilityCallback,
  ]);

  // keep track of expanded heights
  useEffect(() => {
    if (!expandableRef.current) {
      return;
    }

    const height = measureElementHeight(expandableRef.current);

    onHeightChange?.(height);
  }, [
    onHeightChange,
    expandableRef,
  ]);

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
      ref={rootRef}
      onBlur={(evt) => {
        if (!nonExpandableMenu) {
          handleBlur(evt, rootRef);
        }
      }}
      className={cva([
        styles.expandableMenu,
        className,
        styles[colorMode],
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
          colorMode={colorMode}
          element='button'
          ariaExpanded={menuVisible}
          ariaLabel={getCurrentLang().text}
          autoFocus={toggleButtonAutofocus}
          ariaDescription={`${title}: ${description}` || undefined}
        />
      )}

      <div
        className={listClasses({
          menuVisible: nonExpandableMenu || menuVisible,
          nonExpandableMenu,
        })}
        inert={!nonExpandableMenu && !menuVisible}
        ref={expandableRef}
      >
        <ul className={styles.list}>
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
                colorMode={colorMode}
                element='button'
                disabled={!nonExpandableMenu && item.value === currentLang}
                ariaLabel={nonExpandableMenu
                  ? item.text
                  : undefined
                }
                ariaCurrent={
                  item.value === currentLang
                    ? true
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
