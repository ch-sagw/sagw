import {
  isMagazineEditor, isSagwTenant, isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';
import {
  AccessArgs,
  AccessResult,
} from 'payload';

// -> sagw-admin, tenant-admin and magazine-editor
const accessGenericNoTranslator = ({
  req,
}: AccessArgs): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

// -> sagw-admin, tenant-admin
const accessGenericNoTranslatorNoEditor = ({
  req,
}: AccessArgs): AccessResult => isSuperAdmin(req) || isTenantAdmin(req);

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
