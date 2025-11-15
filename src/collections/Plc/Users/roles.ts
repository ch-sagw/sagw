// ########################################################################
// Roles definitions
// ########################################################################

import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { PayloadRequest } from 'payload';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';

export const userRoles = {
  admin: 'super-admin',
  user: 'global-user',
} as const;

export type UserRole = typeof userRoles[keyof typeof userRoles];

export const tenantRoles = {
  admin: 'tenant-admin',
  editorMagazine: 'editor-magazine',
  translator: 'translator',
} as const;

export type TenantRole = typeof tenantRoles[keyof typeof tenantRoles];

// ########################################################################
// Helpers
// ########################################################################

const getRequestedTenant = (req: PayloadRequest): string => {

  // req.data.tenant might be empty. in this case we get tenant from cookie
  const requestedTenant = req?.data?.tenant;
  const tenantFromCookie = getTenantFromCookie(req?.headers, req.payload.db.defaultIDType);

  return requestedTenant || tenantFromCookie;
};

const hasAccessOnRole = (req: PayloadRequest, role: TenantRole): boolean => {
  // get all tenants on which this user has the requested role
  const roleTenantAccessIDs = getUserTenantIDs(req.user, role);

  // get the requested tenant.
  const requestedTenant = getRequestedTenant(req);

  if (requestedTenant && roleTenantAccessIDs.includes(requestedTenant)) {
    return true;
  }

  return false;
};

/*
const isSagwTenant = async (req: PayloadRequest): Promise<boolean> => {
  const requestedTenantId = getRequestedTenant(req);

  if (!requestedTenantId) {
    return false;
  }

  const requestedTenant = await req.payload.findByID({
    collection: 'tenants',
    id: requestedTenantId,
  });

  const tenantName = requestedTenant.name.toLowerCase();

  return tenantName === 'sagw';
};
*/

// ########################################################################
// User roles checks
// ########################################################################
const isUserRoleAdmin = (req: PayloadRequest): boolean => Boolean(req.user?.roles?.includes(userRoles.admin));

const isUserRolelUser = (req: PayloadRequest): boolean => Boolean(req.user?.roles?.includes(userRoles.user));

// ########################################################################
// combined roles checks
// ########################################################################

// checked
export const isSuperAdmin = (req: PayloadRequest): boolean => isUserRoleAdmin(req);

// todo
export const isTenantAdmin = (req: PayloadRequest): boolean => isUserRolelUser(req) && hasAccessOnRole(req, 'tenant-admin');

// todo
export const isMagazineEditor = (req: PayloadRequest): boolean => isUserRolelUser(req) && hasAccessOnRole(req, 'editor-magazine');

// todo
export const isTranslator = (req: PayloadRequest): boolean => isUserRolelUser(req) && hasAccessOnRole(req, 'translator');
