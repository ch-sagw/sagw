import { Payload } from 'payload';
import {
  TenantRole, UserRole,
} from '@/collections/Plc/Users/roles';
import {
  Tenant, User,
} from '@/payload-types';

interface InterfaceSeedUser {
  username: string;
  password: string;
  email: string;
  userRole: UserRole;
  tenantRole?: TenantRole;
  tenant?: Tenant;
}

interface InterfaceSeedUsersProps {
  payload: Payload;
  users: InterfaceSeedUser[];
}

export const seedUsers = async (props: InterfaceSeedUsersProps): Promise<void> => {
  try {
    // we seed users only if there are no existing users
    const users = await props.payload.find({
      collection: 'users',
      limit: 1,
    });

    if (users.docs.length > 0) {
      return;
    }

    // collect user creation promises

    const createUserPromises: Promise<User>[] = [];

    props.users.forEach((user) => {
      createUserPromises.push(props.payload.create({
        collection: 'users',
        data: {
          email: user.email,
          password: user.password,
          roles: [user.userRole],
          tenants: (user.tenant && user.tenantRole)
            ? [
              {
                roles: [user.tenantRole],
                tenant: user.tenant.id,
              },
            ]
            : undefined,
          username: user.username,
        },
      }));
    });

    // resolve all

    await Promise.all(createUserPromises);

    props.payload.logger.info('seed: created initial users');

  } catch (e) {
    props.payload.logger.error('seed: error seeding user');
    props.payload.logger.error(e);
  }
};
