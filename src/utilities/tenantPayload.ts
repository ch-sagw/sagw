import type { Tenant } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';

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
