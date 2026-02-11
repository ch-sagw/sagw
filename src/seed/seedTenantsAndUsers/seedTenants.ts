import { Tenant } from '@/payload-types';
import { Payload } from 'payload';

interface InterfaceSeedTenant {
  name: string;
  slug: string;
}

interface InterfaceSeedTenantsProps {
  payload: Payload;
  tenants: InterfaceSeedTenant[];
}

export const seedTenants = async (props: InterfaceSeedTenantsProps): Promise<Tenant[] | undefined> => {
  try {

    // we seed tenants only if there are no existing tenants!

    const tenants = await props.payload.find({
      collection: 'tenants',
      limit: 1,
    });

    if (tenants.docs.length > 0) {
      return undefined;
    }

    // collect tenant creation promises

    const tenantPromises: Promise<Tenant>[] = [];

    props.tenants.forEach((tenant, index) => {
      tenantPromises.push(props.payload.create({
        collection: 'tenants',
        data: {
          domain: `${tenant.slug}.localhost`,
          faviconName: `https://www.foo${index}.bar`,
          name: tenant.name,
          slug: tenant.slug,
          title: tenant.name,
          url: `https://www.foo${index}.bar`,
        },
      }));
    });

    // resolve all

    const createTenantsResponse = await Promise.all(tenantPromises);

    props.payload.logger.info('seed: created initial tenants');

    return createTenantsResponse;

  } catch (e) {
    props.payload.logger.error('seed: error seeding tenant');
    props.payload.logger.error(e);

    return undefined;
  }
};
