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

    setIsTouch(checkTouch);
  }, []);

  return isTouch;
};
