import { Payload } from 'payload';

export const seedInitialUser = async (payload: Payload, tenantId: string): Promise<void> => {
  try {
    // Check if any users exist
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (users.docs.length === 0) {
      if (!tenantId) {
        throw new Error('seed: error seeding tenant');
      }

      // create the first admin user and link it to the tenant
      if (process.env.PAYLOAD_INITIAL_USER_MAIL && process.env.PAYLOAD_INITIAL_PASSWORD) {
        await payload.create({
          collection: 'users',
          data: {
            department: tenantId,
            departments: [
              {
                department: tenantId,
                roles: ['admin'],
              },
            ],
            email: process.env.PAYLOAD_INITIAL_USER_MAIL,
            password: process.env.PAYLOAD_INITIAL_PASSWORD,
            roles: ['global-admin'],
            username: 'init-user',
          },
        });

        payload.logger.info('seed: created first user.');
      } else {
        payload.logger.error('seed: PAYLOAD_INITIAL_USER_MAIL & PAYLOAD_INITIAL_PASSWORD env vars must be defined');
      }
    }
  } catch (e) {
    payload.logger.error('seed: error seeding user');
    payload.logger.error(e);
  }
};
