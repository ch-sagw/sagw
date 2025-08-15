import type { Access } from 'payload';

import type {
  Tenant, User,
} from '@/payload-types';

import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import {
  departmentRoles, userRoles,
} from '@/collections/Users/roles';

export const createAccess: Access<User> = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isGlobalAdmin(req.user)) {
    return true;
  }

  if (!isGlobalAdmin(req.user) && req.data?.roles?.includes(userRoles.admin)) {
    return false;
  }

  const adminTenantAccessIDs = getUserTenantIDs(req.user, departmentRoles.admin);

  const requestedTenants: Tenant['id'][] =
    req.data?.tenants?.map((t: { tenant: Tenant['id'] }) => t.tenant) ?? [];

  const hasAccessToAllRequestedTenants = requestedTenants.every((tenantID) => adminTenantAccessIDs.includes(tenantID));

  if (hasAccessToAllRequestedTenants) {
    return true;
  }

  return false;
};
