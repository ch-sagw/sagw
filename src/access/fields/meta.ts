import {
  isMagazineEditor, isSuperAdmin, isTenantAdmin,
  isTranslator,
} from '@/collections/Plc/Users/roles';
import { PayloadRequest } from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
}

const accessFieldMeta = ({
  req,
}: InterfaceAccessParam): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req) || isTranslator(req);

export const fieldAccessMeta = {
  create: accessFieldMeta,
  read: accessFieldMeta,
  update: accessFieldMeta,
};
