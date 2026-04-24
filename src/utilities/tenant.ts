import type {
  Config, Tenant,
} from '@/payload-types';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import type { TypedLocale } from 'payload';
import { getPayloadCached } from './getPayloadCached';

// Locales shown in the frontend for this tenant. If `languages` is unset,
// all configured locales are enabled.
export const getEnabledLocalesForTenant = (tenant: Pick<Tenant, 'languages'> | null | undefined): TypedLocale[] => {
  const locales = getLocaleCodes() as TypedLocale[];

  if (!tenant?.languages) {
    return locales;
  }

  return locales.filter((locale) => Boolean(tenant.languages?.[locale]));
};

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
