import { OVERVIEW_BLOCK_TYPES } from '@/blocks';

export const createSingleOverviewBlockFilter = <T extends string>(
  allBlockTypes: readonly T[],
) => ({
    siblingData,
  }: any): T[] | true => {
    // Get content array, handle case where it doesn't exist or isn't an array
    const content = (siblingData as any)?.content;

    if (!content || !Array.isArray(content)) {
      return true;
    }

    // Check if any overview block is already present
    const hasOverviewBlock = content.some((block: any) => block &&
      typeof block === 'object' &&
      'blockType' in block &&
      OVERVIEW_BLOCK_TYPES.includes(block.blockType as any));

    // If an overview block is already present, filter out all overview blocks
    if (hasOverviewBlock) {
      return allBlockTypes.filter((blockType) => !OVERVIEW_BLOCK_TYPES.includes(blockType as any)) as T[];
    }

    // If no overview block is present, show all blocks
    return true;
  };
