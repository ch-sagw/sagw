import { Access } from 'payload';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { isSuperAdmin } from '@/access/isSuperAdmin';

/**
 * Tenant admins and super admins can will be allowed access
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

  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin');
  const requestedTenant = req?.data?.tenant;

  if (requestedTenant && adminTenantAccessIDs.includes(requestedTenant)) {
    return true;
  }

  return false;
};
