import { Payload } from 'payload';
import { seedInitialUser } from '@/seed/init/user';
import { seedTenant } from '@/seed/init/tenant';

export const seedInitialUserAndTenant = async (payload: Payload): Promise<string | undefined> => {
  const tenantId = await seedTenant(payload, 'SAGW', 'sagw');

  if (tenantId) {
    await seedInitialUser(payload, tenantId);

    return tenantId;
  }

  return undefined;
};
