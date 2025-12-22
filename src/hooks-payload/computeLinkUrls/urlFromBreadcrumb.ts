import { homeSlug } from '@/collections/Pages/Singletons/Home';
import type {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';

interface InterfaceGeneratePageUrlParams {
  page: {
    slug: Record<string, string>;
    breadcrumb: InterfaceBreadcrumb;
  };
  tenant: string | null;
  locale: Config['locale'];
}

// generates a single url for a page given locale, tenant, breadcrumb
export const urlFromBreadcrumb = ({
  page,
  tenant,
  locale,
}: InterfaceGeneratePageUrlParams): string | undefined => {
  try {
    const slug: string = page.slug[locale];

    if (!slug || typeof slug !== 'string') {
      return undefined;
    }

    // Build path from breadcrumb
    const {
      breadcrumb,
    } = page;
    let path = '';

    if (breadcrumb && Array.isArray(breadcrumb) && breadcrumb.length > 0) {
      const breadcrumbsToProcess = breadcrumb.slice(0);
      const [firstBreadcrumb] = breadcrumbsToProcess;
      let startIndex = 0;

      if (firstBreadcrumb && typeof firstBreadcrumb === 'object') {
        const localeSlugField = `slug${locale}` as keyof typeof firstBreadcrumb;
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
          const localeSlugField = `slug${locale}` as keyof typeof crumb;
          const crumbSlug = crumb[localeSlugField];

          return typeof crumbSlug === 'string' && crumbSlug
            ? crumbSlug
            : null;
        })
        .filter((s): s is string => Boolean(s));

      path = breadcrumbSlugs.join('/');
    }

    // build final URL
    // Format: /{locale}/{tenant?}/{path-to-page}
    // (tenant is only included if it's not 'sagw')
    const localePath = `/${locale}/`;
    const tenantPath = tenant && tenant !== 'sagw'
      ? `${tenant}/`
      : '';

    // "home" is a special case
    if (slug === homeSlug) {
      const basePath = `${localePath}${tenantPath}`;

      // Remove trailing slash if tenantPath is empty
      return tenantPath
        ? basePath.slice(0, -1)
        : localePath.slice(0, -1);
    }

    const pagePath = path
      ? `${path}/${slug}`
      : slug;

    return `${localePath}${tenantPath}${pagePath}`;
  } catch (error) {
    console.error('Error generating page URL:', error);

    return undefined;
  }
};

