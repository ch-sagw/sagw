import { Access } from 'payload';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { departmentRoles } from '@/collections/Users/roles';

/**
 * Tenant admins and global admins will be allowed access
 */
export const globalAdminOrTenantAdminAccess: Access = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isGlobalAdmin(req.user)) {
    return true;
  }

  const adminTenantAccessIDs = getUserTenantIDs(req.user, departmentRoles.admin);
  const requestedTenant = req?.data?.tenant;

  if (requestedTenant && adminTenantAccessIDs.includes(requestedTenant)) {
    return true;
  }

  return false;
};
