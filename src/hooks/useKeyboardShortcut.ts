import { useEffect } from 'react';

interface InterfaceUseKeyboardShortcutProps {
  key: string
  onKeyPressed: () => void;
  condition?: boolean | undefined;
}

/**
 * Listens to keydown event. optionally, a condition can be passed. Only if
 * the condition is truthy, the keydown event handler will trigger.
 */

export const useKeyboardShortcut = ({
  key,
  onKeyPressed,
  condition,
}: InterfaceUseKeyboardShortcutProps): void => {
  useEffect(() => {
    const keyDownHandler = (e: globalThis.KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        onKeyPressed();
      }
    };

    if (condition === undefined) {
      document.addEventListener('keydown', keyDownHandler);
    } else {
      if (condition) {
        document.addEventListener('keydown', keyDownHandler);
      }
    }

    return (): void => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [
    key,
    onKeyPressed,
    condition,
  ]);
};

