import { deleteData } from '@/seed/test-data/deleteData';
import { addDataForTenant } from '@/seed/test-data/tenantData';
import { Payload } from 'payload';
import { seedTenantsAndUsers } from '@/seed/seedTenantsAndUsers/index';

export const seedTestData = async (payload: Payload): Promise<void> => {

  // security check: we need to be absolutely sure that we don't run this
  // on prod. it should be only run in playwright tests. we already have
  // a check in payload.config. double security.
  const isPlaywright = process.env.DATABASE_NAME === 'sagwplaywright' && process.env.DATABASE_URI?.includes('sagwplaywright');
  const isSeed = process.env.ENV === 'seed' && process.env.DATABASE_NAME === 'sagwlocal' && process.env.DATABASE_URI?.includes('sagwlocal');

  if (!(isPlaywright || isSeed)) {
    return;
  }

  // see comment in playwright be config
  if (isPlaywright && process.env.DOSEED !== 'true') {
    return;
  }

  try {
    // delete all collections
    await deleteData(payload);
    payload.logger.info('seed test data: collections & versions deleted');

    // create tenants and users
    const tenants = await seedTenantsAndUsers({
      payload,
    });

    if (tenants.length !== 2) {
      payload.logger.error('seed test data: error seeding test data');

      return;
    }

    const tenantSagw = tenants.filter((tenant) => tenant.slug === 'sagw');
    const tenantNotSagw = tenants.filter((tenant) => tenant.slug === 'not-sagw');

    if (!(tenantSagw && tenantSagw.length === 1) || !(tenantNotSagw && tenantNotSagw.length === 1)) {
      payload.logger.error('seed test data: error seeding test data');

      return;
    }

    // add data for tenant 1
    await addDataForTenant({
      payload,
      tenant: tenantSagw[0].name,
      tenantId: tenantSagw[0].id,
    });

    payload.logger.info('seed test data: added data for tenant 1');

    // add data for tenant 2
    await addDataForTenant({
      payload,
      tenant: tenantNotSagw[0].name,
      tenantId: tenantNotSagw[0].id,
    });

    payload.logger.info('seed test data: added data for tenant 2');

  } catch (e) {
    payload.logger.error('seed test data: error seeding test data');
    payload.logger.error(e);
    throw e;
  }
};
