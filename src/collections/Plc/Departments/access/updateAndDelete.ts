import { Access } from 'payload';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import { departmentRoles } from '@/collections/Plc/Users/roles';

export const updateAndDeleteAccess: Access = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isGlobalAdmin(req.user)) {
    return true;
  }

  return {
    id: {
      in: getUserDepartmentIDs(req.user, departmentRoles.admin),
    },
  };
};
