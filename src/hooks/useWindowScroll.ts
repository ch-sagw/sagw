import {
  useEffect, useState,
} from 'react';

export const useWindowScroll = (): number => {
  const [
    scroll,
    setScroll,
  ] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScroll(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return (): void => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scroll;
};
