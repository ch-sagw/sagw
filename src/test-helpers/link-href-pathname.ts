import { getServerSideURL } from '@/utilities/getUrl';

// Pathname from a rendered link href (relative or absolute)
// for stable test assertions
export const pathnameFromLinkHref = (href: string | null): string => {
  if (!href) {
    throw new Error('href is null');
  }

  const origin = getServerSideURL()
    .replace(/\/+$/u, '');

  return new URL(href, `${origin}/`).pathname;
};
