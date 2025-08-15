import type { Access } from 'payload';

import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { isAccessingSelf } from '@/collections/Users/access/isAccessingSelf';
import { departmentRoles } from '@/collections/Users/roles';

export const updateAndDeleteAccess: Access = ({
  req, id,
}) => {
  const {
    user,
  } = req;

  if (!user) {
    return false;
  }

  if (isGlobalAdmin(user) || isAccessingSelf({
    id,
    user,
  })) {
    return true;
  }

  /**
   * Constrains update and delete access to users that belong
   * to the same tenant as the department-admin making the request
   *
   * You may want to take this a step further with a beforeChange
   * hook to ensure that the a department-admin can only remove users
   * from their own tenant in the tenants array.
   */
  return {
    'tenants.tenant': {
      in: getUserTenantIDs(user, departmentRoles.admin),
    },
  };
};
