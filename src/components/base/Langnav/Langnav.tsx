// TODO
// close on escape

'use client';

import React, {
  useEffect, useState,
} from 'react';
import { cva } from 'cva';
import { Button } from '@/components/base/Button/Button';
import styles from '@/components/base/Langnav/Langnav.module.scss';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

// --- Types

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

// --- Component

export const Langnav = ({
  items,
  className,
  onLangSelect,
  currentLang,
}: InterfaceLangnavPropTypes): React.JSX.Element => {

  // --- State

  const [
    menuVisible,
    setMenuVisible,
  ] = useState(false);

  const [
    toggleButtonAutofocus,
    setToggleButtonAutofocus,
  ] = useState(false);

  // --- Helpers

  const toggleMenu = ({
    show,
    skipAutofocus,
  }: {
    show: boolean;
    skipAutofocus: boolean;
  }): void => {
    setMenuVisible(show);

    if (!skipAutofocus) {
      setToggleButtonAutofocus(!show);
    }
  };

  const getCurrentLang = (): InterfaceLangnavItem => {
    const langObj = items.filter((item) => item.value === currentLang);

    if (langObj.length === 1) {
      return langObj[0];
    }

    return items[0];
  };

  // --- Hoooks

  const isTouchDevice = useIsTouchDevice();
  const breakpoint = useBreakpoint();

  useKeyboardShortcut({
    condition: menuVisible,
    key: 'Escape',
    onKeyPressed: () => {
      toggleMenu({
        show: false,
        skipAutofocus: false,
      });
    },
  });

  const reducedMenu = breakpoint === 'zero' || breakpoint === 'micro' || breakpoint === 'small' || breakpoint === 'medium';

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

  const listClasses = cva([styles.list], {
    variants: {
      reducedMenu: {
        true: [styles.reduced],
        white: null,
      },
    },
  });

  // --- Effects

  useEffect(() => {
    toggleMenu({
      show: reducedMenu,
      skipAutofocus: true,
    });
  }, [reducedMenu]);

  // --- Event Handlers

  const onClick = (e: React.PointerEvent<HTMLButtonElement>): void => {
    if (!isTouchDevice && e.nativeEvent.pointerType === 'mouse') {
      return;
    }

    toggleMenu({
      show: !menuVisible,
      skipAutofocus: false,
    });
  };

  const onMouseEnter = (): void => {
    if (isTouchDevice) {
      return;
    }

    toggleMenu({
      show: true,
      skipAutofocus: false,
    });
  };

  const onMouseLeave = (): void => {
    if (isTouchDevice) {
      return;
    }

    toggleMenu({
      show: false,
      skipAutofocus: false,
    });
  };

  // --- Render

  return (
    <div
      className={classes({
        menuVisible,
      })}
      onMouseEnter={reducedMenu
        ? undefined
        : onMouseEnter}
      onMouseLeave={reducedMenu
        ? undefined
        : onMouseLeave}
    >

      {/* --- Toggle button */}
      {!reducedMenu &&
        <Button
          onClick={onClick}
          className={styles.currentLang}
          text={getCurrentLang().shortText}
          style='text'
          colorMode='dark'
          element='button'
          ariaExpanded={menuVisible}
          autoFocus={toggleButtonAutofocus}
        />
      }

      {/* --- List of languages */}
      <ul
        className={listClasses({
          reducedMenu,
        })}
        inert={!menuVisible}
      >
        {items.map((item, key: number) => (
          <li
            key={key}
          >
            <Button
              onClick={() => {
                toggleMenu({
                  show: false,
                  skipAutofocus: false,
                });

                onLangSelect();
              }}
              className={styles.item}
              text={reducedMenu
                ? item.shortText
                : item.text
              }
              style='text'
              colorMode='dark'
              element='button'
              disabled={!reducedMenu && item.value === currentLang}
              ariaCurrent={(item.value === currentLang && reducedMenu)
                ? true
                : undefined
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
