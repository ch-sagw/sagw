import type { Tenant } from '@/payload-types';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import type { TypedLocale } from 'payload';

// Locales shown in the frontend for this tenant. If `languages` is unset,
// all configured locales are enabled.
export const getEnabledLocalesForTenant = (tenant: Pick<Tenant, 'languages'> | null | undefined): TypedLocale[] => {
  const locales = getLocaleCodes() as TypedLocale[];

  if (!tenant?.languages) {
    return locales;
  }

  return locales.filter((locale) => Boolean(tenant.languages?.[locale]));
};

export { getTenantById } from '@/utilities/tenantPayload';
export {
  getTenantHomeUrl,
  getTenantSlugFromPageDoc,
} from '@/utilities/tenantPublic';
