/*

------------------------------------------------------------------------------
presence of 1 block of onlyAllowedOnceBlockTypes
removes all onlyAllowedOnceBlockTypes
------------------------------------------------------------------------------

allBlockTypes: A, B, C, D, E, F
onlyAllowedOnceBlockTypes: A, B, C

if either A, B or C block type is present, blocks are filtered to return this:
D, E, F

*/

export const excludeBlocksFilterCumulative = <T extends string>(
  {
    allBlockTypes,
    onlyAllowedOnceBlockTypes,
  }: {
    allBlockTypes: readonly T[];
    onlyAllowedOnceBlockTypes: string[];
  },
) => ({
    siblingData,
  }: any): T[] | true => {
    try {
      const content = (siblingData as any)?.content;

      if (!content || !Array.isArray(content)) {
        return true;
      }

      const hasAllowedOnceBlockTypes = content.some((block: any) => block &&
        typeof block === 'object' &&
        'blockType' in block &&
        onlyAllowedOnceBlockTypes.includes(block.blockType as any));

      if (!hasAllowedOnceBlockTypes) {
        return true;
      }

      return allBlockTypes.filter((blockType) => !onlyAllowedOnceBlockTypes.includes(blockType as any)) as T[];
    } catch (error) {
      console.error('Error in excludeBlocksFilterCumulative:', error);

      return true;
    }
  };

/*
------------------------------------------------------------------------------
presence of 1 block of onlyAllowedOnceBlockTypes
only removes that block from onlyAllowedOnceBlockTypes
------------------------------------------------------------------------------

allBlockTypes: A, B, C, D, E, F
onlyAllowedOnceBlockTypes: A, B

if A block type is present, blocks are filtered to return this:
B, C, D, E, F

*/

export const excludeBlocksFilterSingle = <T extends string>(
  {
    allBlockTypes,
    onlyAllowedOnceBlockTypes,
  }: {
    allBlockTypes: readonly T[];
    onlyAllowedOnceBlockTypes: string[];
  },
) => ({
    siblingData,
  }: any): T[] | true => {
    try {
      const content = siblingData?.content;

      if (!content || !Array.isArray(content)) {
        return true;
      }

      const foundBlocks: string[] = [];

      onlyAllowedOnceBlockTypes.forEach((blockType) => {
        content.forEach((block: any) => {
          if (block && typeof block === 'object' && 'blockType' in block) {
            if (block.blockType === blockType) {
              foundBlocks.push(block.blockType);
            }
          }
        });
      });

      return allBlockTypes.filter((blockType) => !foundBlocks.includes(blockType as any)) as T[];
    } catch (error) {
      console.error('Error in excludeBlocksFilterSingle:', error);

      return true;
    }
  };

