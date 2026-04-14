import {
  AccessArgs,
  AccessResult,
  PayloadRequest,
} from 'payload';
import {
  getRequestedTenant,
  isMagazineEditor,
  isSuperAdmin, isTenantAdmin,
  tenantRoles,
} from '@/collections/Plc/Users/roles';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';

interface InterfaceAccessParam {
  req: PayloadRequest;
  id?: string | number;
}

const allAccess = (): boolean => true;

// Allow super-admin, tenant-admin, and magazine-editor to set tenant field
// This matches the roles that can create pages
const tenantFieldCreateAccess = ({
  req,
}: { req: PayloadRequest }): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

const tenantFieldDeleteAccess = ({
  req,
}: { req: PayloadRequest }): boolean => isSuperAdmin(req);

const tenantCollectionReadAccess = ({
  req,
}: AccessArgs): AccessResult => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req)) {
    return true;
  }

  if (!isTenantAdmin(req)) {
    return false;
  }

  return {
    id: {
      in: getUserTenantIDs(req.user, tenantRoles.admin),
    },
  };
};

const tenantCollectionUpdateAccess = ({
  req,
}: AccessArgs): AccessResult => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req)) {
    return true;
  }

  if (!isTenantAdmin(req)) {
    return false;
  }

  const requestedTenant = getRequestedTenant(req);

  if (!requestedTenant) {
    return false;
  }

  return getUserTenantIDs(req.user, tenantRoles.admin)
    .includes(requestedTenant);
};

export const tenantsAccess = {
  create: tenantFieldCreateAccess,
  delete: tenantFieldDeleteAccess,
  read: allAccess,
  update: allAccess,
};

export const tenantsCollectionAccess = {
  create: tenantFieldDeleteAccess,
  delete: tenantFieldDeleteAccess,
  read: tenantCollectionReadAccess,
  update: tenantCollectionUpdateAccess,
};

// Field access functions use InterfaceAccessParam
// (req and optional id) instead of AccessArgs
const fieldSuperAdminAccess = ({
  req,
}: InterfaceAccessParam): boolean => isSuperAdmin(req);

const fieldAdminAccess = ({
  req,
}: InterfaceAccessParam): boolean => isSuperAdmin(req) || isTenantAdmin(req);

export const fieldsAccess = {
  create: fieldSuperAdminAccess,
  delete: fieldSuperAdminAccess,
  read: allAccess,
  update: fieldSuperAdminAccess,
};

export const languageAccess = {
  create: fieldSuperAdminAccess,
  delete: fieldSuperAdminAccess,
  read: allAccess,
  update: fieldAdminAccess,
};
