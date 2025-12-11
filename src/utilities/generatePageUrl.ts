import type { BasePayload } from 'payload';
import type {
  Config, InterfaceBreadcrumb, Tenant,
} from '@/payload-types';

type Locale = Config['locale'];

type BreadcrumbItem = Exclude<InterfaceBreadcrumb, null>[number];

interface InterfaceGeneratePageUrlParams {
  page: {
    slug: string | Partial<Record<Locale, string>>;
    breadcrumb?: InterfaceBreadcrumb | null;
  };
  tenant: Tenant | string | null | undefined;
  locale: Locale;
  payload: BasePayload;
}

// Extracts the slug for a given locale from a breadcrumb item
const getBreadcrumbSlug = (
  breadcrumbItem: BreadcrumbItem,
  locale: Locale,
): string | undefined => {
  const localizedSlug = breadcrumbItem[`slug${locale}` as keyof typeof breadcrumbItem] as string | null | undefined;

  if (localizedSlug) {
    return localizedSlug;
  }

  return undefined;
};

// Processes breadcrumb array and returns path segments
const processBreadcrumb = (
  breadcrumb: NonNullable<InterfaceBreadcrumb>,
  locale: Locale,
): string[] => {
  const pathSegments: string[] = [];

  if (breadcrumb.length === 0) {
    return pathSegments;
  }

  const [firstBreadcrumb] = breadcrumb;

  if (!firstBreadcrumb) {
    return pathSegments;
  }

  const firstSlug = getBreadcrumbSlug(firstBreadcrumb, locale);

  // Skip 'home' if it's the first breadcrumb, otherwise add it
  if (firstSlug && firstSlug !== 'home') {
    pathSegments.push(firstSlug);
  }

  // Add remaining breadcrumb items
  for (let i = 1; i < breadcrumb.length; i++) {
    const breadcrumbItem = breadcrumb[i];

    if (breadcrumbItem) {
      const breadcrumbSlug = getBreadcrumbSlug(breadcrumbItem, locale);

      if (breadcrumbSlug) {
        pathSegments.push(breadcrumbSlug);
      }
    }
  }

  return pathSegments;
};

/**
 * Generates a URL for a page in the format: /{locale}/{tenant?}/{path-to-page}
 * - locale is always present
 * - tenant is only present if tenant.slug !== 'sagw'
 * - path-to-page is built from breadcrumb array (skip 'home' if first item)
 * - current page slug is appended at the end
 */
export const generatePageUrl = async ({
  page,
  tenant,
  locale,
  payload,
}: InterfaceGeneratePageUrlParams): Promise<string> => {

  // Get tenant slug if tenant exists
  let tenantSlug: string | null = null;

  if (tenant) {
    let tenantDoc: Tenant | null = null;

    if (typeof tenant === 'string') {
      // Fetch tenant by ID
      try {
        tenantDoc = await payload.findByID({
          collection: 'tenants',
          id: tenant,
          locale,
        });
      } catch {
        // Tenant not found, continue without tenant slug
      }
    } else {
      tenantDoc = tenant;
    }

    if (tenantDoc?.slug) {
      // Get localized slug or fallback to any locale
      // Tenant slug is localized, so it can be a string or a localized object
      const slugValue = tenantDoc.slug as string | Partial<Record<Locale, string>>;
      let localizedSlug: string | undefined;

      if (typeof slugValue === 'string') {
        localizedSlug = slugValue;
      } else {
        // Handle localized slug object
        localizedSlug = slugValue[locale] || undefined;
      }

      if (localizedSlug && localizedSlug !== 'sagw') {
        tenantSlug = localizedSlug;
      }
    }
  }

  // Get page slug for the locale
  let pageSlug: string | null = null;

  if (typeof page.slug === 'string') {
    // If slug is a string, it's non-localized and applies to all locales
    pageSlug = page.slug;
  } else if (page.slug && typeof page.slug === 'object') {
    // Localized slug object
    const slugForLocale = page.slug[locale];

    if (slugForLocale && typeof slugForLocale === 'string' && slugForLocale.trim() !== '') {
      pageSlug = slugForLocale;
    } else {
      pageSlug = null;
    }
  }

  // If no slug exists for this locale, return just the locale path
  if (!pageSlug) {
    return `/${locale}`;
  }

  // Build path from breadcrumb
  const pathSegments: string[] = [];

  if (page.breadcrumb && Array.isArray(page.breadcrumb) && page.breadcrumb.length > 0) {
    const breadcrumbSegments = processBreadcrumb(page.breadcrumb, locale);

    pathSegments.push(...breadcrumbSegments);
  }

  // Add current page slug at the end
  pathSegments.push(pageSlug);

  // Build final URL
  const path = pathSegments.join('/');
  const tenantPart = tenantSlug
    ? `/${tenantSlug}`
    : '';

  return `/${locale}${tenantPart}/${path}`;
};
