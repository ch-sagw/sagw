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

import { BlockSlug } from '@/blocks';

export const excludeBlocksFilterCumulative = ({
  allBlockTypes,
  onlyAllowedOnceBlockTypes,
}: {
    allBlockTypes: BlockSlug[];
    onlyAllowedOnceBlockTypes: BlockSlug[];
  }) => ({
  siblingData,
}: any): BlockSlug[] => {
  try {
    const content = siblingData?.content;

    if (!content || !Array.isArray(content)) {
      return allBlockTypes;
    }

    const hasAllowedOnceBlockTypes = content.some((block) => block &&
        typeof block === 'object' &&
        'blockType' in block &&
        onlyAllowedOnceBlockTypes.includes(block.blockType));

    if (!hasAllowedOnceBlockTypes) {
      return allBlockTypes;
    }

    return allBlockTypes.filter((blockType) => !onlyAllowedOnceBlockTypes.includes(blockType));
  } catch (error) {
    console.error('Error in excludeBlocksFilterCumulative:', error);

    return allBlockTypes;
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

export const excludeBlocksFilterSingle = ({
  allBlockTypes,
  onlyAllowedOnceBlockTypes,
}: {
    allBlockTypes: BlockSlug[];
    onlyAllowedOnceBlockTypes: BlockSlug[];
  }) => ({
  siblingData,
}: any): BlockSlug[] => {
  try {
    const content = siblingData?.content;

    if (!content || !Array.isArray(content)) {
      return allBlockTypes as BlockSlug[];
    }

    const foundBlocks: BlockSlug[] = [];

    onlyAllowedOnceBlockTypes.forEach((blockType) => {
      content.forEach((block) => {
        if (block && typeof block === 'object' && 'blockType' in block) {
          if (block.blockType === blockType) {
            foundBlocks.push(block.blockType);
          }
        }
      });
    });

    return allBlockTypes.filter((blockType) => !foundBlocks.includes(blockType));
  } catch (error) {
    console.error('Error in excludeBlocksFilterSingle:', error);

    return allBlockTypes;
  }
};

