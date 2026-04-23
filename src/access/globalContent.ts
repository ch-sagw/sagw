import {
  getRequestedTenant,
  isMagazineEditor, isSagwTenant, isSuperAdmin, isTenantAdmin,
  tenantRoles,
  userRoles,
} from '@/collections/Plc/Users/roles';
import {
  AccessArgs,
  AccessResult,
} from 'payload';
import type { User } from '@/payload-types';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';

// Same roles as isTenantAdmin / isMagazineEditor, but without requiring tenant
// cookie / req.data.tenant. Admin internals (e.g. copy locale) sometimes run
// with no tenant context.
const hasTenantAdminOnJwt = (req: AccessArgs['req']): boolean => {
  if (!req.user || !req.user.roles?.includes(userRoles.user)) {
    return false;
  }

  return getUserTenantIDs(req.user as User, tenantRoles.admin).length > 0;
};

const hasMagazineEditorOnJwt = (req: AccessArgs['req']): boolean => {
  if (!req.user || !req.user.roles?.includes(userRoles.user)) {
    return false;
  }

  return getUserTenantIDs(req.user as User, tenantRoles.editorMagazine).length > 0;
};

// -> sagw-admin, tenant-admin and magazine-editor
// When tenant cookie / context is missing (e.g. Payload "copy from locale"
// server actions), isTenantAdmin / isMagazineEditor fail; use JWT roles only.
const accessGenericNoTranslator = ({
  req,
}: AccessArgs): AccessResult => {
  if (isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req)) {
    return true;
  }

  if (
    !getRequestedTenant(req) &&
    (hasTenantAdminOnJwt(req) || hasMagazineEditorOnJwt(req))
  ) {
    return true;
  }

  return false;
};

// -> sagw-admin, tenant-admin
const accessGenericNoTranslatorNoEditor = ({
  req,
}: AccessArgs): AccessResult => {
  if (isSuperAdmin(req) || isTenantAdmin(req)) {
    return true;
  }

  if (!getRequestedTenant(req) && hasTenantAdminOnJwt(req)) {
    return true;
  }

  return false;
};

// -> sagw-admin, tenant-admin (non-sagw only)
const accessGlobalContentTheme = async ({
  req,
}: AccessArgs): Promise<AccessResult> => {
  if (isSuperAdmin(req)) {
    return true;
  }

  if (isTenantAdmin(req)) {
    const sagwTenant = await isSagwTenant(req);

    return !sagwTenant;
  }

  return false;
};

export const globalContentAccessGeneric = {
  create: accessGenericNoTranslator,
  delete: accessGenericNoTranslator,
  read: accessGenericNoTranslator,
  update: accessGenericNoTranslator,
};

export const globalContentAccessNoTranslatorNoEditor = {
  create: accessGenericNoTranslatorNoEditor,
  delete: accessGenericNoTranslatorNoEditor,
  read: accessGenericNoTranslatorNoEditor,
  update: accessGenericNoTranslatorNoEditor,
};

export const globalContentAccessTheme = {
  create: accessGlobalContentTheme,
  delete: accessGlobalContentTheme,
  read: accessGlobalContentTheme,
  update: accessGlobalContentTheme,
};
