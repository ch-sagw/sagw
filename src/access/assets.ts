import {
  isMagazineEditor, isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';
import {
  AccessResult, PayloadRequest,
} from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
}

// -> Only super-admin, sagw-admin, fg-admin and magazine editors
const accessGeneric = ({
  req,
}: InterfaceAccessParam): AccessResult => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

export const assetsAccess = {
  create: accessGeneric,
  delete: accessGeneric,
  read: accessGeneric,
  update: accessGeneric,
};
