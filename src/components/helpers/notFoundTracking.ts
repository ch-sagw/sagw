/**
 * Pure helpers for the 404 tracking. Kept free of `next/*` imports so the
 * Playwright specs can import them (see `TrackNotFound.tsx` for the
 * component).
 */

/**
 * Returns true when the visitor came from a page of this very website,
 * i.e. the 404 was most likely caused by one of our own (broken) links.
 * Direct hits, bots and external referrers return false.
 */
export const isInternalReferrer = (referrer: string, origin: string): boolean => {
  if (!referrer) {
    return false;
  }

  try {
    return new URL(referrer).origin === origin;
  } catch {
    return false;
  }
};

// Pages seen since the last full page load. `document.referrer` does not
// change on client side navigation (next/link), so this is how a 404 knows
// that the visitor came from one of our own pages.
let currentPathname: string | null = null;
let previousPathname: string | null = null;

export const recordVisitedPathname = (pathname: string): void => {
  if (pathname === currentPathname) {
    return;
  }

  previousPathname = currentPathname;
  currentPathname = pathname;
};

/** True when another page of this site was shown before `pathname`. */
export const cameFromInAppPage = (pathname: string): boolean => (currentPathname === pathname
  ? previousPathname !== null
  : currentPathname !== null);

/** The label of the 404 event: path plus query string of the missing url. */
export const buildNotFoundLabel = ({
  pathname,
  search,
}: {
  pathname: string;
  search: string;
}): string => `${pathname}${search}`;
