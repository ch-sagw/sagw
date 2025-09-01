import { Access } from 'payload';
// import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
// import { departmentRoles } from '@/collections/Plc/Users/roles';

/**
 * Department admins and global admins are allowed access to update and delete
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

  // TODO: req.data.department is empty. find workaround or other solution
  return true;

  /*
  const adminDepartmentAccessIDs = getUserDepartmentIDs(
    req.user,
    departmentRoles.admin);
  const requestedDepartment = req?.data?.department;

  if (requestedDepartment
    && adminDepartmentAccessIDs.includes(requestedDepartment)) {
    return true;
  }

  return false;
  */
};

/**
 * Authenticated users are allowed to create
 */

// TODO: only allow create if selected tenant is in user's departments array
// problem: req.data.department is empty, since i assume it's only pouplated
// on update or deletion.
export const createAccess: Access = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  return true;
};
