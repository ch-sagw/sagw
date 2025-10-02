import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { Access } from 'payload';
import { tenantRoles } from '@/collections/Plc/Users/roles';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';

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
  const tenantFromCookie = getTenantFromCookie(req?.headers, req.payload.db.defaultIDType);

  // req.data.tenant might be empty. in this case we get tenant from cookie
  const ensuredTenant = requestedTenant || tenantFromCookie;

  if (ensuredTenant && adminTenantAccessIDs.includes(ensuredTenant)) {
    return true;
  }

  return false;
};
