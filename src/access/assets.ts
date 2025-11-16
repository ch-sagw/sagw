import {
  isMagazineEditor, isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';
import {
  AccessArgs,
  AccessResult,
} from 'payload';

// -> Only super-admin, sagw-admin, fg-admin and magazine editors
const accessGeneric = ({
  req,
}: AccessArgs): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

export const assetsAccess = {
  create: accessGeneric,
  delete: accessGeneric,
  read: accessGeneric,
  update: accessGeneric,
};
