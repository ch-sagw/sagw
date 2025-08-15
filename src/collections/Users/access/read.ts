import type { User } from '@/payload-types';
import type {
  Access, Where,
} from 'payload';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';

import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { isAccessingSelf } from '@/collections/Users/access/isAccessingSelf';
import { getCollectionIDType } from '@/utilities/getCollectionIdType';
import { departmentRoles } from '@/collections/Users/roles';

export const readAccess: Access<User> = ({
  req, id,
}) => {
  if (!req?.user) {
    return false;
  }

  if (isAccessingSelf({
    id,
    user: req.user,
  })) {
    return true;
  }

  const superAdmin = isGlobalAdmin(req.user);
  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({
      collectionSlug: 'tenants',
      payload: req.payload,
    }),
  );
  const adminTenantAccessIDs = getUserTenantIDs(req.user, departmentRoles.admin);

  if (selectedTenant) {
    // If it's a super admin, or they have access to the tenant ID set in cookie
    const hasTenantAccess = adminTenantAccessIDs.some((accessId) => accessId === selectedTenant);

    if (superAdmin || hasTenantAccess) {
      return {
        'tenants.tenant': {
          equals: selectedTenant,
        },
      };
    }
  }

  if (superAdmin) {
    return true;
  }

  return {
    or: [
      {
        id: {
          equals: req.user.id,
        },
      },
      {
        'tenants.tenant': {
          in: adminTenantAccessIDs,
        },
      },
    ],
  } as Where;
};
