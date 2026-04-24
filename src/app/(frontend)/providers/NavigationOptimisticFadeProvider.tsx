'use client';

import {
  Suspense,
  useLayoutEffect,
} from 'react';
import {
  usePathname,
  useSearchParams,
} from 'next/navigation';

const DOC_ATTR = 'data-nav-pending-exit';

const clearPending = (): void => {
  document.documentElement.removeAttribute(DOC_ATTR);
};

const setPending = (): void => {
  document.documentElement.setAttribute(DOC_ATTR, '');
};

const isModifiedEvent = (e: MouseEvent): boolean => (
  e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
);

const shouldTriggerOptimisticExit = (
  anchor: HTMLAnchorElement,
  e: MouseEvent,
): boolean => {
  if (e.defaultPrevented || isModifiedEvent(e)) {
    return false;
  }

  if (anchor.target && anchor.target !== '_self') {
    return false;
  }

  if (anchor.hasAttribute('download')) {
    return false;
  }

  const href = anchor.getAttribute('href');

  if (!href || href.startsWith('#')) {
    return false;
  }

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }

  try {
    const url = new URL(anchor.href, window.location.href);

    if (url.origin !== window.location.origin) {
      return false;
    }

    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const ClearPendingExitOnLocationChange = (): null => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationKey = `${pathname}?${searchParams.toString()}`;

  useLayoutEffect(() => {
    clearPending();
  }, [locationKey]);

  return null;
};

const NavigationOptimisticFadeClickCapture = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  useLayoutEffect(() => {
    const onClickCapture = (e: MouseEvent): void => {
      if (
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      const {
        target,
      } = e;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a');

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (!shouldTriggerOptimisticExit(anchor, e)) {
        return;
      }

      setPending();
    };

    document.addEventListener('click', onClickCapture, true);

    return (): void => {
      document.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  return <>{children}</>;
};

export const NavigationOptimisticFadeProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <NavigationOptimisticFadeClickCapture>
    <Suspense fallback={null}>
      <ClearPendingExitOnLocationChange />
    </Suspense>
    {children}
  </NavigationOptimisticFadeClickCapture>
);
