'use client';

import React, {
  RefObject, useEffect, useState,
} from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

// --- Interfaces

export interface InterfaceExpandableElement {
  activeElement: number | undefined;
  onToggleClick: (key: number) => void;
  toggleButtonAutofocus: boolean;
  buttonRefs: RefObject<(HTMLButtonElement | null)[]>;
}

// --- Hook

export const useExpandOnClick = (): InterfaceExpandableElement => {

  // --- Refs

  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // --- State

  const [
    activeElement,
    setActiveElement,
  ] = useState<number | undefined>(undefined);

  const [
    lastActiveElement,
    setLastActiveElement,
  ] = useState<number | undefined>(undefined);

  const [
    toggleButtonAutofocus,
    setToggleButtonAutofocus,
  ] = useState<boolean>(false);

  // --- Effects

  useEffect(() => {
    if (toggleButtonAutofocus && lastActiveElement) {
      buttonRefs.current[lastActiveElement]?.focus();
    }
  }, [
    toggleButtonAutofocus,
    lastActiveElement,
  ]);

  // --- Hooks

  useKeyboardShortcut({
    condition: activeElement !== undefined,
    key: 'Escape',
    onKeyPressed: () => {

      // as soon as closed, we want to set the focus. but after closed,
      // the state for activeElement is already undefined.
      setLastActiveElement(activeElement);

      setActiveElement(undefined);
      setToggleButtonAutofocus(true);

    },
  });

  // --- Event handlers

  const onToggleClick = (key: number): void => {
    setToggleButtonAutofocus(false);
    if (key === activeElement) {
      setActiveElement(undefined);
    } else {
      setActiveElement(key);
    }
  };

  return {
    activeElement,
    buttonRefs,
    onToggleClick,
    toggleButtonAutofocus,
  };

};
