import { BlockSlug } from '@/blocks';
import {
  isMagazineEditor, isSagwTenant, isSuperAdmin, isTenantAdmin,
  isTranslator,
} from '@/collections/Plc/Users/roles';
import { PayloadRequest } from 'payload';

interface InterfaceAccessParam {
  req: PayloadRequest;
  allBlocks: BlockSlug[];
  restrictedBlocks: BlockSlug[];
}

export const sagwOnlyBlocks = async (props: InterfaceAccessParam): Promise<BlockSlug[]> => {
  if (isTranslator(props.req)) {
    return [];
  }

  if (isSuperAdmin(props.req) || isMagazineEditor(props.req)) {
    return props.allBlocks;
  }

  if (isTenantAdmin(props.req)) {
    const sagwTenant = await isSagwTenant(props.req);

    if (sagwTenant) {
      return props.allBlocks;
    }
  }

  return props.allBlocks.filter((item) => !props.restrictedBlocks.includes(item));
};
