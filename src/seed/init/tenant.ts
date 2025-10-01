import { Payload } from 'payload';

export const seedTenant = async (payload: Payload, tenantName: string, tenantSlug: string): Promise<string | undefined> => {

  try {
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 1,
    });

    if (tenants.docs.length === 0) {
      const tenant = await payload.create({
        collection: 'tenants',
        data: {
          domain: `${tenantSlug}.localhost`,
          name: tenantName,
          slug: tenantSlug,
        },
      });

      payload.logger.info('seed: created initial tenant');

      return tenant.id;
    }

    return undefined;

  } catch (e) {
    payload.logger.error('seed: error seeding tenant');
    payload.logger.error(e);

    return undefined;
  }
};
