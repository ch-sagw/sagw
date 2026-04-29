import type { Config } from '@/payload-types';

// returns the tenant's home URL for the given locale.
export const getTenantHomeUrl = ({
  locale,
  tenantSlug,
}: {
  locale: Config['locale'];
  tenantSlug?: string;
}): string => {
  if (!tenantSlug || tenantSlug === 'sagw') {
    return `/${locale}`;
  }

  return `/${locale}/${tenantSlug}`;
};

// extracts tenant slug from pageDoc.tenant when populated (depth >= 1).
export const getTenantSlugFromPageDoc = (pageDoc: Record<string, unknown> | null | undefined): string | undefined => {
  if (!pageDoc) {
    return undefined;
  }

  const {
    tenant,
  } = pageDoc;

  if (tenant && typeof tenant === 'object' && 'slug' in tenant) {
    return tenant.slug as string;
  }

  return undefined;
};
