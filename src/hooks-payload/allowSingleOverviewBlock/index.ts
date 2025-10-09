import { OVERVIEW_BLOCK_TYPES } from '@/blocks';

export const allowSingleOverviewBlock = (value: unknown): true | string => {
  if (!Array.isArray(value)) {
    return true;
  }

  const overviewBlockCount = value.filter((block) => block &&
    typeof block === 'object' &&
    'blockType' in block &&
    OVERVIEW_BLOCK_TYPES.includes(block.blockType as any)).length;

  if (overviewBlockCount > 1) {
    // TODO: this is not working. Seems not possible to overwrite the
    // payload error in this case? (block-level validation error message)

    return 'Only 1 overview block per page allowed';
  }

  return true;
};
