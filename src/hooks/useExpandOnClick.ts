'use client';

import { useState } from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export interface InterfaceExpandableElement {
  activeElement: number | undefined;
  onToggleClick: (key: number) => void;
}

export const useExpandOnClick = (): InterfaceExpandableElement => {
  const [
    activeElement,
    setActiveElement,
  ] = useState<number | undefined>(undefined);

  useKeyboardShortcut({
    condition: activeElement !== undefined,
    key: 'Escape',
    onKeyPressed: () => {
      setActiveElement(undefined);
    },
  });

  const onToggleClick = (key: number): void => {
    if (key === activeElement) {
      setActiveElement(undefined);
    } else {
      setActiveElement(key);
    }
  };

  return {
    activeElement,
    onToggleClick,
  };

};
