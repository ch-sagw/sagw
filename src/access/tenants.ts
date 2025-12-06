import { PayloadRequest } from 'payload';
import {
  isMagazineEditor,
  isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';

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

export const tenantsAccess = {
  create: tenantFieldCreateAccess,
  delete: tenantFieldDeleteAccess,
  read: allAccess,
  update: allAccess,
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
