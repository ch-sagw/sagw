import {
  useEffect, useState,
} from 'react';

export const useIsTouchDevice = (): boolean => {
  const [
    isTouch,
    setIsTouch,
  ] = useState(false);

  useEffect(() => {
    const checkTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    // Defer setState to avoid synchronous setState in effect
    const rafId = requestAnimationFrame(() => {
      setIsTouch(checkTouch);
    });

    return (): void => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return isTouch;
};
