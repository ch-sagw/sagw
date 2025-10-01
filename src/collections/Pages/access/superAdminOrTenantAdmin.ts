import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { Access } from 'payload';
import { tenantRoles } from '@/collections/Plc/Users/roles';

/**
 * Tenant admins and super admins will be allowed access
 */
export const superAdminOrTenantAdminAccess: Access = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  const adminTenantAccessIDs = getUserTenantIDs(req.user, tenantRoles.admin);
  const requestedTenant = req?.data?.tenant;

  if (requestedTenant && adminTenantAccessIDs.includes(requestedTenant)) {
    return true;
  }

  return false;
};
