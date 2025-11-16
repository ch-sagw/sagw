/*

------------------------------------------------------------------------------
presence of 1 block of onlyAllowedOnceBlockTypes removes all
blocks of onlyAllowedOnceBlockTypes from return value.
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
  }: any): T[] => {
    try {
      const content = (siblingData as any)?.content;

      if (!content || !Array.isArray(content)) {
        return allBlockTypes as T[];
      }

      const hasAllowedOnceBlockTypes = content.some((block: any) => block &&
        typeof block === 'object' &&
        'blockType' in block &&
        onlyAllowedOnceBlockTypes.includes(block.blockType as any));

      if (!hasAllowedOnceBlockTypes) {
        return allBlockTypes as T[];
      }

      return allBlockTypes.filter((blockType) => !onlyAllowedOnceBlockTypes.includes(blockType as any)) as T[];
    } catch (error) {
      console.error('Error in excludeBlocksFilterCumulative:', error);

      return allBlockTypes as T[];
    }
  };

/*
------------------------------------------------------------------------------
presence of 1 block of onlyAllowedOnceBlockTypes only removes that block from
return value.
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
        return allBlockTypes as T[];
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

      return allBlockTypes as T[];
    }
  };

