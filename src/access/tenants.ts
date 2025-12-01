import type { AccessArgs } from 'payload';
import {
  isMagazineEditor,
  isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';

const allAccess = (): boolean => true;

const adminAccess = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req) || isTenantAdmin(req);

const superAdminAccess = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req);

// Allow super-admin, tenant-admin, and magazine-editor to set tenant field
// This matches the roles that can create pages
const tenantFieldCreateAccess = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

export const tenantsAccess = {
  create: tenantFieldCreateAccess,
  delete: superAdminAccess,
  read: allAccess,
  update: allAccess,
};

export const fieldsAccess = {
  create: superAdminAccess,
  delete: superAdminAccess,
  read: allAccess,
  update: superAdminAccess,
};

export const languageAccess = {
  create: superAdminAccess,
  delete: superAdminAccess,
  read: allAccess,
  update: adminAccess,
};
