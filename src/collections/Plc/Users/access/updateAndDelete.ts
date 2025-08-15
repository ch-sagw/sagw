import type { Access } from 'payload';

import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { isAccessingSelf } from '@/collections//Plc/Users/access/isAccessingSelf';
import { departmentRoles } from '@/collections/Plc/Users/roles';

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
   * to the same department as the department-admin making the request
   */
  return {
    'departments.department': {
      in: getUserDepartmentIDs(user, departmentRoles.admin),
    },
  };
};
