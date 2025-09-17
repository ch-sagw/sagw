import {
  useEffect, useState,
} from 'react';
import { breakpoints } from '@/styles/css-variables/breakpoints';

type BreakpointName = keyof typeof breakpoints;

const breakpointQueries: Record<BreakpointName, string> = {
  large: `(min-width: ${breakpoints.large}px) and (max-width: ${breakpoints.wide - 1}px)`,
  medium: `(min-width: ${breakpoints.medium}px) and (max-width: ${breakpoints.large - 1}px)`,
  micro: `(min-width: ${breakpoints.micro}px) and (max-width: ${breakpoints.small - 1}px)`,
  small: `(min-width: ${breakpoints.small}px) and (max-width: ${breakpoints.medium - 1}px)`,
  ultra: `(min-width: ${breakpoints.ultra}px)`,
  wide: `(min-width: ${breakpoints.wide}px) and (max-width: ${breakpoints.ultra - 1}px)`,
  zero: `(min-width: ${breakpoints.zero}px) and (max-width: ${breakpoints.micro - 1}px)`,
};

export const useBreakpoint = (): BreakpointName => {
  const getCurrent = (): BreakpointName => {
    for (const [
      name,
      query,
    ] of Object.entries(breakpointQueries) as [BreakpointName, string][]) {
      if (window.matchMedia(query).matches) {
        return name;
      }
    }

    return 'zero';
  };

  const [
    breakpoint,
    setBreakpoint,
  ] = useState<BreakpointName>(() => getCurrent());

  useEffect(() => {
    const mqls = Object.entries(breakpointQueries)
      .map(([
        name,
        query,
      ]) => {
        const mql = window.matchMedia(query);
        const listener = (e: MediaQueryListEvent): void => {
          if (e.matches) {
            setBreakpoint(name as BreakpointName);
          }
        };

        mql.addEventListener('change', listener);

        return {
          listener,
          mql,
        };
      });

    return (): void => {
      mqls.forEach(({
        mql, listener,
      }) => mql.removeEventListener('change', listener));
    };
  }, []);

  return breakpoint;
};
