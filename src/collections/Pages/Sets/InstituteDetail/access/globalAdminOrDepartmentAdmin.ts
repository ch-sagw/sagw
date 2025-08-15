import { Access } from 'payload';
import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { departmentRoles } from '@/collections/Users/roles';

/**
 * Department admins and global admins will be allowed access
 */
export const globalAdminOrDepartmentAdminAccess: Access = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isGlobalAdmin(req.user)) {
    return true;
  }

  const adminDepartmentAccessIDs = getUserDepartmentIDs(req.user, departmentRoles.admin);
  const requestedDepartment = req?.data?.department;

  if (requestedDepartment && adminDepartmentAccessIDs.includes(requestedDepartment)) {
    return true;
  }

  return false;
};
