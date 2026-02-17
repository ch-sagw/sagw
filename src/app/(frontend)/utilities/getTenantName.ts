import 'server-only';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export const getTenantName = async ({
  id,
}: {
  id: string;
}): Promise<any> => {
  const payload = await getPayloadCached();

  const tenant = await payload.findByID({
    collection: 'tenants',
    id,
    locale: 'all',
  });

  return tenant;
};
