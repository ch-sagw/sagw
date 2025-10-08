import { OVERVIEW_BLOCK_TYPES } from '@/blocks';

export const createSingleOverviewBlockFilter = <T extends string>(
  allBlockTypes: readonly T[],
) => ({
    siblingData,
  }: any): T[] | true => {
    try {
      // Get content array, handle case where it doesn't exist or isn't an array
      const content = (siblingData as any)?.content;

      if (!content || !Array.isArray(content)) {
        return true;
      }

      // Check if any overview block exists
      const hasAnyOverviewBlock = content.some((block: any) => block &&
        typeof block === 'object' &&
        'blockType' in block &&
        OVERVIEW_BLOCK_TYPES.includes(block.blockType as any));

      // If no overview blocks exist, show all blocks
      if (!hasAnyOverviewBlock) {
        return true;
      }

      // If any overview block exists, filter out ALL overview blocks
      // This prevents adding any more overview blocks (even the same type)
      return allBlockTypes.filter((blockType) => !OVERVIEW_BLOCK_TYPES.includes(blockType as any)) as T[];
    } catch (error) {
      // If anything goes wrong, show all blocks to avoid breaking the form
      console.error('Error in createSingleOverviewBlockFilter:', error);

      return true;
    }
  };
