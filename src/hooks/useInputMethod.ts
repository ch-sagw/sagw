
import {
  useEffect, useState,
} from 'react';

export const useInputMethod = (): boolean => {
  const [
    isKeyboard,
    setIsKeyboard,
  ] = useState(false);

  useEffect(() => {
    const handleKeyDown = (): void => setIsKeyboard(true);
    const handleMouseDown = (): void => setIsKeyboard(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboard;
};
