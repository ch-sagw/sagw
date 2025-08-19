import type { User } from '@/payload-types';
import type {
  Access, Where,
} from 'payload';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';

import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import { isAccessingSelf } from '@/collections/Plc/Users/access/isAccessingSelf';
import { getCollectionIDType } from '@/utilities/getCollectionIdType';
import { departmentRoles } from '@/collections/Plc/Users/roles';

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
  const selectedDepartment = getTenantFromCookie(
    req.headers,
    getCollectionIDType({
      collectionSlug: 'departments',
      payload: req.payload,
    }),
  );
  const adminDeartmentAccessIDs = getUserDepartmentIDs(req.user, departmentRoles.admin);

  if (selectedDepartment) {
    // If it's a super admin, or they have access to the department ID
    // set in cookie
    const hasDepartmentAccess = adminDeartmentAccessIDs.some((accessId) => accessId === selectedDepartment);

    if (superAdmin || hasDepartmentAccess) {
      return {
        'departments.department': {
          equals: selectedDepartment,
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
        'departments.department': {
          in: adminDeartmentAccessIDs,
        },
      },
    ],
  } as Where;
};
