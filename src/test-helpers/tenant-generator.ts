import { Tenant } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';

interface InterfaceGenerateTenantProps {
  name: string;
}

export const generateTenant = async ({
  name,
}: InterfaceGenerateTenantProps): Promise<Tenant> => {
  const payload = await getPayloadCached();

  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name,
      slug: name,
      title: name,
    },
    draft: false,
    overrideAccess: true,
  });

  await payload.update({
    collection: 'tenants',
    data: {
      ...tenant,
      slug: `${name}-fr`,
    },
    id: tenant.id,
    locale: 'fr',
  });

  await payload.update({
    collection: 'tenants',
    data: {
      ...tenant,
      slug: `${name}-en`,
    },
    id: tenant.id,
    locale: 'en',
  });

  await payload.update({
    collection: 'tenants',
    data: {
      ...tenant,
      slug: `${name}-it`,
    },
    id: tenant.id,
    locale: 'it',
  });

  return tenant;
};
