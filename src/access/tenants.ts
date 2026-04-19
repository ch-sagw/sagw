import {
  AccessArgs, AccessResult, PayloadRequest,
} from 'payload';
import {
  isMagazineEditor,
  isSuperAdmin, isTenantAdmin, tenantRoles,
} from '@/collections/Plc/Users/roles';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';

interface InterfaceAccessParam {
  req: PayloadRequest;
  id?: string | number;
}

const allAccess = (): boolean => true;

// ##########################################################################
// Collection-level access for the `tenants` collection
//
// Uses query constraints for read/update so unauthenticated callers cannot
// list, read, or update tenant records through the REST API, and so that
// tenant-admins can only see/modify tenants they actually administer.
// ##########################################################################

// -> super-admin: all tenants
// -> authenticated users with a `tenants[]` entry (tenant-admin, magazine
//    editor, translator): only their own tenants (query constraint)
// -> unauthenticated: denied
const tenantsCollectionRead = ({
  req,
}: AccessArgs): AccessResult => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req)) {
    return true;
  }

  const userTenantIds = getUserTenantIDs(req.user);

  if (userTenantIds.length === 0) {
    return false;
  }

  return {
    id: {
      in: userTenantIds,
    },
  };
};

// -> super-admin: all tenants
// -> tenant-admin: only tenants they administer (query constraint)
// -> others: denied
//
// NOTE: field-level update rules still gate which fields of the tenant
// record can be modified. Today tenant-admins can only change `languages.*`
// via `languageAccess`; everything else requires super-admin.
const tenantsCollectionUpdate = ({
  req,
}: AccessArgs): AccessResult => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req)) {
    return true;
  }

  const adminTenantIds = getUserTenantIDs(req.user, tenantRoles.admin);

  if (adminTenantIds.length === 0) {
    return false;
  }

  return {
    id: {
      in: adminTenantIds,
    },
  };
};

// -> super-admin, tenant-admin, magazine-editor
//
// NOTE: tenant-admin and magazine-editor pass this access check but are
// rejected downstream (status 400) by tenant validation hooks. See the
// `can not create tenants` tests in access-org.be.spec.ts.
const tenantsCollectionCreate = ({
  req,
}: { req: PayloadRequest }): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

// -> super-admin only
const tenantsCollectionDelete = ({
  req,
}: { req: PayloadRequest }): boolean => isSuperAdmin(req);

export const tenantsCollectionAccess = {
  create: tenantsCollectionCreate,
  delete: tenantsCollectionDelete,
  read: tenantsCollectionRead,
  update: tenantsCollectionUpdate,
};

// ##########################################################################
// Field-level access for the `tenant` relationship field injected by the
// multi-tenant plugin into every other collection.
//
// Field-level access MUST return boolean — query constraints are not
// supported here by Payload.
//
// Reading the tenant value on an already-readable doc is safe (the parent
// collection's read access already gates visibility).
// Creating a doc with a tenant is allowed for any content-creating role.
// Updating (re-parenting) a doc to a different tenant is restricted to
// super-admin to prevent cross-tenant escalation.
// ##########################################################################

const tenantFieldCreateAccess = ({
  req,
}: { req: PayloadRequest }): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

const tenantFieldUpdateAccess = ({
  req,
}: { req: PayloadRequest }): boolean => isSuperAdmin(req);

const tenantFieldDeleteAccess = ({
  req,
}: { req: PayloadRequest }): boolean => isSuperAdmin(req);

export const tenantsAccess = {
  create: tenantFieldCreateAccess,
  delete: tenantFieldDeleteAccess,
  read: allAccess,
  update: tenantFieldUpdateAccess,
};

// ##########################################################################
// Field-level access for individual fields on the Tenants collection itself
// ##########################################################################

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
