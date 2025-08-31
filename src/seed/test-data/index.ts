import { deleteData } from '@/seed/test-data/deleteData';
import { addDataForTenant } from '@/seed/test-data/tenant1Data';
import { Payload } from 'payload';

export const seedTestData = async (payload: Payload): Promise<void> => {

  // security check: we need to be absolutely sure that we don't run this
  // on prod. it should be only run in playwright tests. we already have
  // a check in payload.config. double security.
  const isPlaywright = process.env.DATABASE_NAME === 'sagwplaywright' && process.env.DATABASE_URI?.includes('sagwplaywright');
  const isSeed = process.env.ENV === 'seed' && process.env.DATABASE_NAME === 'sagwlocal' && process.env.DATABASE_URI?.includes('sagwlocal');

  if (!(isPlaywright || isSeed)) {
    return;
  }

  try {
    // delete all collections
    await deleteData(payload);
    payload.logger.info('seed test data: collections & versions deleted');

    // add data for tenant 1
    await addDataForTenant(payload, 'sagw');
    payload.logger.info('seed test data: added data for tenant 1');

    // add data for tenant 2
    await addDataForTenant(payload, 'not-sagw');
    payload.logger.info('seed test data: added data for tenant 2');

  } catch (e) {
    payload.logger.error('seed test data: error seeding test data');
    payload.logger.error(e);
    throw e;
  }
};
