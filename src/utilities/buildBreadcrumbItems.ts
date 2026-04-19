import type { Config } from '@/payload-types';
import type { InterfaceBreadcrumb } from '@/utilities/buildBreadcrumbs';
import { InterfaceBreadcrumbItem } from '@/components/base/Breadcrumb/Breadcrumb';
import { getBreadcrumbPathSegments } from '@/utilities/getBreadcrumbPathSegments';
import { buildUrlFromPath } from '@/utilities/buildUrlFromPath';
import { homeSlug } from '@/collections/constants';

interface InterfaceBuildBreadcrumbItemsParams {
  breadcrumb: InterfaceBreadcrumb;
  locale: Config['locale'];
  tenant: string | null;
}

//  builds breadcrumb items from a breadcrumb array
export const buildBreadcrumbItems = ({
  breadcrumb,
  locale,
  tenant,
}: InterfaceBuildBreadcrumbItemsParams): InterfaceBreadcrumbItem[] => {
  if (!breadcrumb || !Array.isArray(breadcrumb) || breadcrumb.length === 0) {
    return [];
  }

  // get path segments using the same logic as urlFromBreadcrumb
  const pathSegments = getBreadcrumbPathSegments({
    breadcrumb,
    locale,
  });

  if (pathSegments.length === 0) {
    return [];
  }

  // determine start index (skip "home" if it's the first breadcrumb)
  const [firstBreadcrumb] = breadcrumb;
  let startIndex = 0;
  let shouldAddHomeLink = false;

  if (firstBreadcrumb && typeof firstBreadcrumb === 'object') {
    const firstSlug = firstBreadcrumb.slug?.[locale];

    if (firstSlug === homeSlug) {
      startIndex = 1;
      shouldAddHomeLink = true;
    }
  }

  const breadcrumbItems: InterfaceBreadcrumbItem[] = [];

  // add Home link at the beginning if needed
  if (shouldAddHomeLink) {
    const homeName = firstBreadcrumb && typeof firstBreadcrumb === 'object'
      ? firstBreadcrumb.name?.[locale]
      : null;

    if (typeof homeName === 'string') {
      const homeUrl = buildUrlFromPath({
        locale,
        pathSegments: [],
        slug: homeSlug,
        tenant,
      });

      breadcrumbItems.push({
        link: homeUrl,
        text: homeName,
      });
    }
  }

  // build items by iterating through breadcrumb items and
  // matching with path segments
  const breadcrumbSlice = breadcrumb.slice(startIndex);
  let pathSegmentIndex = 0;

  breadcrumbSlice.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const itemSlug = item.slug?.[locale];
    const text = item.name?.[locale];

    // only process items whose slug matches the current path segment
    if (
      typeof itemSlug === 'string' &&
      itemSlug &&
      pathSegmentIndex < pathSegments.length &&
      pathSegments[pathSegmentIndex] === itemSlug &&
      typeof text === 'string'
    ) {
      const itemPathSegments = pathSegments.slice(0, pathSegmentIndex + 1);
      const itemUrl = buildUrlFromPath({
        locale,
        // all segments except the last one
        pathSegments: itemPathSegments.slice(0, -1),
        // last segment is the slug
        slug: itemPathSegments[itemPathSegments.length - 1],
        tenant,
      });

      breadcrumbItems.push({
        link: itemUrl,
        text,
      });

      pathSegmentIndex++;
    }
  });

  return breadcrumbItems;
};
