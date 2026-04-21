import type {
  Config, Tenant,
} from '@/payload-types';
import { getPayloadCached } from './getPayloadCached';

export const getTenantById = async ({
  id,
}: {
  id: string;
}): Promise<Tenant> => {
  const payload = await getPayloadCached();

  const tenant = await payload.findByID({
    collection: 'tenants',
    id,
    locale: 'all',
  });

  return tenant;
};

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

// extracts tenant slug record from a pageDoc's tenant
// relationship (populated with depth >= 1). returns undefined if the
// tenant is not populated on the doc.
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
