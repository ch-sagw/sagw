import { BlockSlug } from '@/blocks';
import {
  isMagazineEditor, isSagwTenant, isSuperAdmin, isTenantAdmin,
  isTranslator,
} from '@/collections/Plc/Users/roles';
import { PayloadRequest } from 'payload';

interface InterfaceSagwOnlyBlocksProps {
  req: PayloadRequest;
  allBlocks: BlockSlug[];
  restrictedBlocks: BlockSlug[];
}

interface InterfaceAllBlocksButTranslatorProps {
  req: PayloadRequest;
  allBlocks: BlockSlug[];
}

export const sagwOnlyBlocks = async (props: InterfaceSagwOnlyBlocksProps): Promise<BlockSlug[]> => {
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

export const allBlocksButTranslator = (props: InterfaceAllBlocksButTranslatorProps): BlockSlug[] => {
  if (isTranslator(props.req)) {
    return [];
  }

  return props.allBlocks;
};
