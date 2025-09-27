'use client';

import {
  RefObject,
  useRef, useState,
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
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  expandableRef: RefObject<(HTMLDivElement | null)>;
  lastReported: RefObject<number | undefined>;
  measureElementHeight: (el: HTMLElement) => number;
}

// --- Hook

export const useExpandOnHover = (): InterfaceExpandableMenu => {

  // --- Refs
  const lastReported = useRef<number | undefined>(undefined);
  const expandableRef = useRef<HTMLDivElement>(null);

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

  const measureElementHeight = (el: HTMLElement): number => {
    if (!el) {
      return 0;
    }

    const clone = el.cloneNode(true) as HTMLElement;

    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    clone.style.height = 'auto';
    clone.style.maxHeight = 'none';
    clone.style.opacity = '0';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    const height = clone.offsetHeight;

    document.body.removeChild(clone);

    return height;
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
    expandableRef,
    lastReported,
    measureElementHeight,
    menuVisible,
    onMouseEnter,
    onMouseLeave,
    onToggleClick,
    toggleButtonAutofocus,
  };
};
