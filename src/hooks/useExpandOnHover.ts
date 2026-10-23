'use client';

import {
  RefObject,
  useCallback,
  useState,
} from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

// --- Interfaces

export interface InterfaceToggleMenuArgs {
  show: boolean;
  autofocus?: boolean;
}

export interface InterfaceExpandableMenu {
  menuVisible: boolean;
  toggleButtonAutofocus: boolean;
  onToggleClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement> | React.PointerEvent<HTMLDivElement | HTMLButtonElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  handleBlur: (e: React.FocusEvent, rootRef: RefObject<HTMLDivElement | null>) => void;
}

// --- Hook

export const useExpandOnHover = (): InterfaceExpandableMenu => {

  // --- State

  const [
    menuVisible,
    setMenuVisible,
  ] = useState<boolean>(false);

  const [
    toggleButtonAutofocus,
    setToggleButtonAutofocus,
  ] = useState<boolean>(false);

  // --- Helpers

  const toggleMenu = useCallback(({
    show,
    autofocus,
  }: InterfaceToggleMenuArgs): void => {
    setMenuVisible(show);

    if (autofocus) {
      setToggleButtonAutofocus(!show);
    } else {
      setToggleButtonAutofocus(false);
    }
  }, []);
  // --- Hooks

  useKeyboardShortcut({
    condition: menuVisible,
    key: 'Escape',
    onKeyPressed: () => {
      toggleMenu({
        autofocus: true,
        show: false,
      });
    },
  });

  // --- Event handlers

  /**
   * Toggles the menu on click, except for real mouse clicks, which are
   * already covered by onMouseEnter/onMouseLeave.
   *
   * Thanks ChatGPT: Keyboard activations arrive as click events with
   * `detail === 0`; in browsers where click is a PointerEvent they
   * additionally report `pointerType === ''`. Touch and pen taps report
   * their respective pointerType and must toggle.
   */
  const onToggleClick = useCallback((e: React.MouseEvent<HTMLDivElement | HTMLButtonElement> | React.PointerEvent<HTMLDivElement | HTMLButtonElement>): void => {
    const native = e.nativeEvent;

    const isMouseClick =
      native.detail > 0 &&
      'pointerType' in native &&
      native.pointerType === 'mouse';

    if (isMouseClick) {
      return;
    }

    setMenuVisible((prev) => !prev);
  }, []);

  const onMouseEnter = useCallback((): void => {
    toggleMenu({
      show: true,
    });
  }, [toggleMenu]);

  const onMouseLeave = useCallback((): void => {
    toggleMenu({
      show: false,
    });
  }, [toggleMenu]);

  const handleBlur = useCallback((e: React.FocusEvent, rootRef: RefObject<HTMLDivElement | null>): void => {
    const related = e.relatedTarget as Node | null;

    // if focus is still inside this menu, do nothing
    if (rootRef.current && related && rootRef.current.contains(related)) {
      return;
    }

    onMouseLeave();
  }, [onMouseLeave]);

  return {
    handleBlur,
    menuVisible,
    onMouseEnter,
    onMouseLeave,
    onToggleClick,
    toggleButtonAutofocus,
  };
};
