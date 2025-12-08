import { TypedLocale } from 'payload';
import {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';

type LocalizedString = Partial<Record<Config['locale'], string>>;

// Get page slug for the target locale with fallback
const getSlugForLocale = (slugObj: LocalizedString, targetLocale: TypedLocale): string => {
  // Try target locale first
  if (slugObj[targetLocale] && typeof slugObj[targetLocale] === 'string' && slugObj[targetLocale].trim().length > 0) {
    return slugObj[targetLocale].trim();
  }

  // Fallback order: de, fr, it, en
  const fallbackOrder: TypedLocale[] = [
    'de',
    'fr',
    'it',
    'en',
  ];

  for (const fallbackLocale of fallbackOrder) {
    if (slugObj[fallbackLocale] && typeof slugObj[fallbackLocale] === 'string' && slugObj[fallbackLocale].trim().length > 0) {
      return slugObj[fallbackLocale].trim();
    }
  }

  return '';
};

/**
 * Generate full page path following exact schema:
 * /{language}/{tenant?}/{path-to-page}
 *
 * @param params - Object containing:
 *   - breadcrumb: Breadcrumb array (can be empty)
 *   - pageSlug: Localized page slug
 *   - locale: Target locale
 *   - tenant: Tenant slug string, tenant object with slug property, or null
 * @returns Full path with leading slash: /{locale}/{tenant?}/{path-to-page}
 */
export const generatePagePath = ({
  breadcrumb,
  pageSlug,
  locale,
  tenant,
}: {
  breadcrumb: InterfaceBreadcrumb;
  pageSlug: LocalizedString;
  locale: TypedLocale;
  tenant: string | { slug?: string } | null;
}): string => {

  // Get page slug
  const pageSlugValue = getSlugForLocale(pageSlug, locale);

  if (!pageSlugValue) {
    return '';
  }

  // Build breadcrumb path segments (excluding "home" breadcrumb)
  const breadcrumbSegments: string[] = [];

  if (breadcrumb && Array.isArray(breadcrumb) && breadcrumb.length > 0) {
    for (const crumb of breadcrumb) {
      // Get slug for this breadcrumb item for the target locale
      const crumbSlugObj: LocalizedString = {
        de: crumb.slugde || undefined,
        en: crumb.slugen || undefined,
        fr: crumb.slugfr || undefined,
        it: crumb.slugit || undefined,
      };

      const crumbSlug = getSlugForLocale(crumbSlugObj, locale);

      // Skip breadcrumb items with slug "home" in any locale
      const isHomeBreadcrumb = crumbSlug === 'home' ||
        crumb.slugde === 'home' ||
        crumb.slugfr === 'home' ||
        crumb.slugit === 'home' ||
        crumb.slugen === 'home';

      if (crumbSlug && crumbSlug.trim().length > 0 && !isHomeBreadcrumb) {
        breadcrumbSegments.push(crumbSlug.trim());
      }
    }
  }

  // Build path segments
  const pathSegments: string[] = [locale];

  // Extract tenant slug
  let tenantSlug: string | null = null;

  if (tenant) {
    if (typeof tenant === 'object' && tenant !== null && 'slug' in tenant) {
      tenantSlug = typeof tenant.slug === 'string'
        ? tenant.slug
        : null;
    }
  }

  // Add tenant segment
  if (tenantSlug && tenantSlug !== 'sagw') {
    pathSegments.push(tenantSlug);
  }

  // Add breadcrumb segments
  pathSegments.push(...breadcrumbSegments);

  // Add page slug
  pathSegments.push(pageSlugValue);

  return `/${pathSegments.join('/')}`;
};
