import {
  isMagazineEditor, isSuperAdmin, isTenantAdmin,
  isTranslator,
} from '@/collections/Plc/Users/roles';
import { PayloadRequest } from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
}

const accessFieldLocalizableAdminsOnly = ({
  req,
}: InterfaceAccessParam): boolean => isSuperAdmin(req) || isTenantAdmin(req);

const accessFieldNonLocalizableDefault = ({
  req,
}: InterfaceAccessParam): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);

const accessFieldLocalizableDefault = ({
  req,
}: InterfaceAccessParam): boolean => isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req) || isTranslator(req);

export const fieldAccessLocalizableField = {
  create: accessFieldLocalizableDefault,
  read: (): boolean => true,
  update: accessFieldLocalizableDefault,
};

export const fieldAccessNonLocalizableField = {
  create: accessFieldNonLocalizableDefault,
  read: (): boolean => true,
  update: accessFieldNonLocalizableDefault,
};

export const fieldAccessAdminsOnly = {
  create: accessFieldLocalizableAdminsOnly,
  read: (): boolean => true,
  update: accessFieldLocalizableAdminsOnly,
};
