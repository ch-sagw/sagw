'use client';

import { useState } from 'react';
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
  toggleMenu: (args: InterfaceToggleMenuArgs) => void;
  onToggleClick: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
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

  const onToggleClick = (e: React.PointerEvent<HTMLButtonElement>): void => {
    if (!isTouchDevice && e.nativeEvent.pointerType === 'mouse') {
      return;
    }

    toggleMenu({
      show: !menuVisible,
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

  return {
    menuVisible,
    onMouseEnter,
    onMouseLeave,
    onToggleClick,
    toggleButtonAutofocus,
    toggleMenu,
  };
};
