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
  href: string;
}

export type InterfaceLangnavPropTypes = {
  items: InterfaceLangnavItem[];
  className?: string;
  currentLang: string;
  colorMode: ColorMode;
  visibilityCallbackAction?: (visible: boolean) => void;
  onHeightChangeAction?: (height: number) => void;
  title?: string;
  description?: string;
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
  currentLang,
  colorMode,
  visibilityCallbackAction,
  onHeightChangeAction,
  description,
  title,
}: InterfaceLangnavPropTypes): React.JSX.Element => {

  // -- Refs

  const rootRef = useRef<HTMLDivElement>(null);
  const expandableRef = useRef<HTMLDivElement>(null);
  const lastReportedVisibility = useRef<boolean | undefined>(undefined);

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

  // Report visibility changes to the parent. Only report when the value
  // actually changed: the callback identity changes with parent state
  // (e.g. Header's isHovering/isKeyboard) and re-reporting a stale
  // "false" from there would reset state the parent just set.
  useEffect(() => {
    if (visibilityCallbackAction && lastReportedVisibility.current !== menuVisible) {
      lastReportedVisibility.current = menuVisible;
      visibilityCallbackAction(menuVisible);
    }
  }, [
    menuVisible,
    visibilityCallbackAction,
  ]);

  // keep track of expanded heights
  useEffect(() => {
    if (!expandableRef.current) {
      return;
    }

    const expandableElement = expandableRef.current;
    const computedStyle = window.getComputedStyle(expandableElement);
    const paddingBlock =
      (parseFloat(computedStyle.paddingBlockStart) || 0) +
      (parseFloat(computedStyle.paddingBlockEnd) || 0);

    const height = measureElementHeight(expandableElement) + paddingBlock;

    onHeightChangeAction?.(height);
  }, [
    onHeightChangeAction,
    expandableRef,
    breakpoint,
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
      data-testid='langnav'
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
      // Hover only for a real mouse. On touch, the toggle button's
      // onClick opens/closes the menu; the compatibility mouse events
      // emitted after a tap must not interfere.
      onPointerEnter={nonExpandableMenu
        ? undefined
        : (e: React.PointerEvent): void => {
          if (e.pointerType === 'mouse') {
            onMouseEnter();
          }
        }}
      onPointerLeave={nonExpandableMenu
        ? undefined
        : (e: React.PointerEvent): void => {
          if (e.pointerType === 'mouse') {
            onMouseLeave();
          }
        }}
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
          isActive={true}
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
          {items.map((item, key: number) => {
            const isCurrentLang = item.value === currentLang;

            return (
              <li
                key={key}
                data-testid={item.value}
              >
                <Button
                  className={styles.item}
                  text={nonExpandableMenu
                    ? item.shortText
                    : item.text}
                  style='text'
                  colorMode={colorMode}
                  element='link'
                  href={item.href}
                  ariaLabel={nonExpandableMenu
                    ? item.text
                    : undefined
                  }
                  ariaCurrent={
                    isCurrentLang
                      ? true
                      : undefined
                  }
                  isActive={
                    item.text === getCurrentLang().text
                      ? true
                      : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
