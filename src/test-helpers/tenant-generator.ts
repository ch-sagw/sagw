import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Tenant } from '@/payload-types';

interface InterfaceGenerateTenantProps {
  name: string;
}

export const generateTenant = async ({
  name,
}: InterfaceGenerateTenantProps): Promise<Tenant> => {
  const payload = await getPayload({
    config: configPromise,
  });

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

  return tenant;
};
