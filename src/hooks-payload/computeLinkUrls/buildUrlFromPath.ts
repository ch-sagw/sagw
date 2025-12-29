import { homeSlug } from '@/collections/constants';

// builds the URL prefix (locale + tenant).
// format: /{locale}/{tenant?}/
// (tenant is only included if it's not 'sagw')
export const getUrlPrefix = ({
  locale,
  tenant,
}: {
  locale: string;
  tenant: string | null;
}): string => {
  const localePath = `/${locale}/`;
  const tenantPath = tenant && tenant !== 'sagw'
    ? `${tenant}/`
    : '';

  return `${localePath}${tenantPath}`;
};

// builds a full URL from path segments and slug.
export const buildUrlFromPath = ({
  pathSegments,
  slug,
  locale,
  tenant,
}: {
  pathSegments: string[];
  slug: string;
  locale: string;
  tenant: string | null;
}): string => {
  const path = pathSegments.join('/');
  const urlPrefix = getUrlPrefix({
    locale,
    tenant,
  });

  // "home" is a special case
  if (slug === homeSlug) {
    const basePath = urlPrefix;

    // remove trailing slash if tenantPath is empty
    return tenant && tenant !== 'sagw'
      ? basePath.slice(0, -1)
      : basePath.slice(0, -1);
  }

  const pagePath = path
    ? `${path}/${slug}`
    : slug;

  return `${urlPrefix}${pagePath}`;
};

