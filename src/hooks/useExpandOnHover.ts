'use client';

import {
  RefObject, useState,
} from 'react';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
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
  onKeyDown: () => void;
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

  const toggleMenu = ({
    show,
    autofocus,
  }: InterfaceToggleMenuArgs): void => {
    setMenuVisible(show);

    if (autofocus) {
      setToggleButtonAutofocus(!show);
    } else {
      setToggleButtonAutofocus(false);
    }
  };

  // --- Hooks

  const isTouchDevice = useIsTouchDevice();

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

  const onToggleClick = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement> | React.PointerEvent<HTMLDivElement | HTMLButtonElement>): void => {
    if ('pointerType' in e.nativeEvent) {
      if (!isTouchDevice && e.nativeEvent.pointerType === 'mouse') {
        return;
      }
    }

    toggleMenu({
      show: !menuVisible,
    });
  };

  const onKeyDown = (): void => {
    if (isTouchDevice) {
      return;
    }

    toggleMenu({
      show: true,
    });
  };

  const onMouseEnter = (): void => {
    if (isTouchDevice) {
      return;
    }

    toggleMenu({
      show: true,
    });
  };

  const onMouseLeave = (): void => {
    if (isTouchDevice) {
      return;
    }

    toggleMenu({
      show: false,
    });
  };

  const handleBlur = (e: React.FocusEvent, rootRef: RefObject<HTMLDivElement | null>): void => {
    const related = e.relatedTarget as Node | null;

    // if focus is still inside this menu, do nothing
    if (rootRef.current && related && rootRef.current.contains(related)) {
      return;
    }

    onMouseLeave();
  };

  return {
    handleBlur,
    menuVisible,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onToggleClick,
    toggleButtonAutofocus,
  };
};
