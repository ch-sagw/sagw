import type { AccessArgs } from 'payload';
import {
  isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';

const allAccess = (): boolean => true;

const adminAccess = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req) || isTenantAdmin(req);

const superAdminAccess = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req);

export const tenantsAccess = {
  create: superAdminAccess,
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
