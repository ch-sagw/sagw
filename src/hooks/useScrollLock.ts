import { useEffect } from 'react';

export const useScrollLock = (condition: boolean): void => {
  useEffect(() => {
    const [html] = document.getElementsByTagName('html');

    if (condition) {
      html.classList.add('scrollLock');
    } else {
      html.classList.remove('scrollLock');
    }

    return (): void => {
      html.classList.remove('scrollLock');
    };
  }, [condition]);
};
