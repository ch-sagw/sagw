// ########################################################################
// Roles definitions
// ########################################################################

import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import {
  ClientUser, PayloadRequest,
} from 'payload';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';
import { getCollectionIDType } from '@/utilities/getCollectionIdType';
import { User } from '@/payload-types';

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

export const getRequestedTenant = (req: PayloadRequest): string => {

  // req.data.tenant might be empty. in this case we get tenant from cookie
  const requestedTenant = req?.data?.tenant;
  const tenantFromCookie = getTenantFromCookie(
    req.headers,
    getCollectionIDType({
      collectionSlug: 'tenants',
      payload: req.payload,
    }),
  );

  return requestedTenant || tenantFromCookie;
};

const hasSuperOrTenantAdminRole = (user: ClientUser): boolean => {

  if (!user) {
    return false;
  }

  const superAdmin = Boolean(user.roles?.includes(userRoles.admin));

  if (superAdmin) {
    return true;
  }

  if ('tenants' in user) {
    const hasAdminRole = user.tenants.filter((tenant: any) => {
      if ('roles' in tenant) {
        return tenant.roles.includes(tenantRoles.admin);
      }

      return false;
    });

    return hasAdminRole.length > 0;
  }

  return false;
};

const hasAccessOnRole = (req: PayloadRequest, role: TenantRole): boolean => {

  if (!req.user) {
    return false;
  }

  // get all tenants on which this user has the requested role
  const roleTenantAccessIDs = getUserTenantIDs(req.user, role);

  // get the requested tenant.
  const requestedTenant = getRequestedTenant(req);

  if (requestedTenant && roleTenantAccessIDs.includes(requestedTenant)) {
    return true;
  }

  return false;
};

export const isSagwTenant = async (req: PayloadRequest): Promise<boolean> => {
  const requestedTenantId = getRequestedTenant(req);

  if (!requestedTenantId) {
    return false;
  }

  try {
    const requestedTenant = await req.payload.findByID({
      collection: 'tenants',
      id: requestedTenantId,
    });

    const tenantName = requestedTenant.name.toLowerCase();

    return tenantName === 'sagw';
  } catch {
    return false;
  }

};

// ########################################################################
// User roles checks
// ########################################################################
const isUserRoleAdmin = (req: PayloadRequest): boolean => Boolean(req.user?.roles?.includes(userRoles.admin));
const isUserRolelUser = (req: PayloadRequest): boolean => Boolean(req.user?.roles?.includes(userRoles.user));

// ########################################################################
// combined roles checks
// ########################################################################
export const isSuperAdmin = (req: PayloadRequest): boolean => isUserRoleAdmin(req);
export const isTenantAdmin = (req: PayloadRequest): boolean => isUserRolelUser(req) && hasAccessOnRole(req, tenantRoles.admin);
export const isMagazineEditor = (req: PayloadRequest): boolean => isUserRolelUser(req) && hasAccessOnRole(req, tenantRoles.editorMagazine);
export const isTranslator = (req: PayloadRequest): boolean => isUserRolelUser(req) && hasAccessOnRole(req, tenantRoles.translator);

// ########################################################################
// display helpers
// ########################################################################

// check for super-admin or tenant-admin while taking user as input param
// useful for usage in: admin -> hidden (on fields or collections)
export const isSuperOrTenantAdmin = (user: ClientUser): boolean => hasSuperOrTenantAdminRole(user);
export const userIsSuperAdmin = (user: User): boolean => {
  if (!user) {
    return false;
  }

  return Boolean(user.roles?.includes(userRoles.admin));
};
