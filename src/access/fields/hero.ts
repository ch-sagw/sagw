import {
  isMagazineEditor, isSagwTenant, isSuperAdmin, isTenantAdmin,
} from '@/collections/Plc/Users/roles';
import { PayloadRequest } from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
}

const accessFieldHeroAnimationDefault = async ({
  req,
}: InterfaceAccessParam): Promise<boolean> => {
  const roleAccess = isSuperAdmin(req) || isTenantAdmin(req) || isMagazineEditor(req);
  const sagwTenant = await isSagwTenant(req);

  return roleAccess && sagwTenant;
};

export const fieldAccessHeroAnimation = {
  create: accessFieldHeroAnimationDefault,
  read: (): boolean => true,
  update: accessFieldHeroAnimationDefault,
};
