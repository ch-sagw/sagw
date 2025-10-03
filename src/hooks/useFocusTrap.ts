import { useEffect } from 'react';

interface InterfaceUseFocusTrap {
  condition: boolean;
  focusTrapRootElement: HTMLElement | null | undefined;
  ignoreElementsWithClasses: string[];
}

export const useFocusTrap = ({
  condition,
  focusTrapRootElement,
  ignoreElementsWithClasses,
}: InterfaceUseFocusTrap): void => {

  useEffect(() => {
    if (!condition) {
      return undefined;
    }

    if (!focusTrapRootElement) {
      return undefined;
    }

    // Get focusable elements
    const focusableElements = focusTrapRootElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');

    if (focusableElements.length === 0) {
      return undefined;
    }

    const focusableArray = Array.from(focusableElements);
    const focusableArrayFiltered = focusableArray.filter((focusableItem) => {
      let ignoreElement = false;

      ignoreElementsWithClasses.forEach((ignoreClass) => {
        if (focusableItem.classList.contains(ignoreClass)) {
          ignoreElement = true;
        }
      });

      return !ignoreElement;
    });

    const lastFocusable = focusableArrayFiltered[focusableArray.length - 1];
    const [firstFocusable] = focusableArrayFiltered;

    // Create a focusable element at the very end that loops back
    const loopTrap = document.createElement('button');

    loopTrap.tabIndex = 0;
    loopTrap.setAttribute('aria-label', 'End of menu');
    loopTrap.style.cssText = 'position: absolute; left: -9999px;';

    const handleLoopFocus = (): void => {
      firstFocusable?.focus();
    };

    loopTrap.addEventListener('focus', handleLoopFocus);
    focusTrapRootElement.appendChild(loopTrap);

    // Keyboard trap
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab') {
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    focusTrapRootElement.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return (): void => {
      loopTrap.removeEventListener('focus', handleLoopFocus);
      focusTrapRootElement.removeEventListener('keydown', handleKeyDown);
      loopTrap.remove();
    };
  }, [
    condition,
    focusTrapRootElement,
    ignoreElementsWithClasses,
  ]);

};
