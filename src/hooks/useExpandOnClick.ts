'use client';

import React, {
  RefObject, useEffect, useState,
} from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export interface InterfaceExpandableElement {
  activeElement: number | undefined;
  onToggleClick: (key: number) => void;
  toggleButtonAutofocus: boolean;
  buttonRefs: RefObject<(HTMLButtonElement | null)[]>;
}

export const useExpandOnClick = (): InterfaceExpandableElement => {
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

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

  useEffect(() => {
    if (toggleButtonAutofocus && lastActiveElement) {
      buttonRefs.current[lastActiveElement]?.focus();
    }
  }, [
    toggleButtonAutofocus,
    lastActiveElement,
  ]);

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
