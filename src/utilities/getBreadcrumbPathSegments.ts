import type {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';

import {
  breadcrumbSlugFieldsPrefix, homeSlug,
} from '@/collections/constants';

// extracts slug segments from breadcrumb items for a given locale.
// this is the core logic shared between
// urlFromBreadcrumb and buildBreadcrumbItems.
//
// - Skips the first breadcrumb if it's "home"
// - Extracts slugs for the specified locale
// - Returns an array of slug segments

export const getBreadcrumbPathSegments = ({
  breadcrumb,
  locale,
}: {
  breadcrumb: InterfaceBreadcrumb;
  locale: Config['locale'];
}): string[] => {
  if (!breadcrumb || !Array.isArray(breadcrumb) || breadcrumb.length === 0) {
    return [];
  }

  const breadcrumbsToProcess = breadcrumb.slice(0);
  const [firstBreadcrumb] = breadcrumbsToProcess;
  let startIndex = 0;

  if (firstBreadcrumb && typeof firstBreadcrumb === 'object') {
    const localeSlugField = `${breadcrumbSlugFieldsPrefix}${locale}` as keyof typeof firstBreadcrumb;
    const firstSlug = firstBreadcrumb[localeSlugField];

    // check if first breadcrumb is "home" for this locale
    if (firstSlug === homeSlug) {
      startIndex = 1;
    }
  }

  // build path from breadcrumb slugs
  const breadcrumbSlugs = breadcrumbsToProcess
    .slice(startIndex)
    .map((crumb) => {
      if (!crumb || typeof crumb !== 'object') {
        return null;
      }

      // get slug for current locale only
      const localeSlugField = `${breadcrumbSlugFieldsPrefix}${locale}` as keyof typeof crumb;
      const crumbSlug = crumb[localeSlugField];

      return typeof crumbSlug === 'string' && crumbSlug
        ? crumbSlug
        : null;
    })
    .filter((s): s is string => Boolean(s));

  return breadcrumbSlugs;
};

