import { Payload } from 'payload';
import { deleteData } from '@/seed/test-data/deleteData';
import { addTenant1Data } from '@/seed/test-data/tenant1Data';
import { addTenant2Data } from '@/seed/test-data/tenant2Data';

export const seedTestData = async (payload: Payload): Promise<void> => {

  // security check: we need to be absolutely sure that we don't run this
  // on prod. it should be only run in playwright tests. we already have
  // a check in payload.config. double security.
  if (!(process.env.DATABASE_NAME === 'sagwplaywright' && process.env.DATABASE_URI?.includes('sagwplaywright'))) {

    return;
  }

  try {
    // delete all collections
    await deleteData(payload);
    payload.logger.info('seed test data: collections deleted');

    // add data for tenant 1
    await addTenant1Data(payload);
    payload.logger.info('seed test data: added data for tenant 1');

    // add data for tenant 2
    await addTenant2Data(payload);
    payload.logger.info('seed test data: added data for tenant 2');

  } catch (e) {
    payload.logger.error('seed test data: error seeding test data');
    payload.logger.error(e);
  }
};
