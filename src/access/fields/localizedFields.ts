import {
  isMagazineEditor, isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';
import { PayloadRequest } from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
}

const accessFieldLocalizableDefault = ({
  req,
}: InterfaceAccessParam): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

export const fieldAccessLocalizableField = {
  create: accessFieldLocalizableDefault,
  read: (): boolean => true,
  update: accessFieldLocalizableDefault,
};
