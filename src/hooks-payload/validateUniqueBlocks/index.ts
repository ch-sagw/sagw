/*
Payload has a "Duplicate" option in the dropdown for blocks. Furthermore,
we can programmatically add blocks.

To prevent this behaviour for blocks which are allowed only once, we use this
validation hook.
*/

/*

CUMULATIVE:
-----------

value: (currently added blocks)
onlyAllowedOnceBlockTypes: D, E, F

valid, if value contains A, B, C, D.
invalid, if value contains A, B, C, D, E.

*/
export const validateUniqueBlocksCumulative = ({
  onlyAllowedOnceBlockTypes,
}: {
  onlyAllowedOnceBlockTypes: string[];
}) => (value: unknown): true | string => {
  if (!Array.isArray(value)) {
    return true;
  }

  const onlyAllowedOnceBlockCount = value.filter((block) => {
    const isBlock = block && typeof block === 'object' && 'blockType' in block;

    if (!isBlock) {
      return false;
    }

    if (onlyAllowedOnceBlockTypes.includes(block.blockType as any)) {
      return true;
    }

    return false;
  });

  if (onlyAllowedOnceBlockCount.length > 1) {
    // TODO: this is not working. Seems not possible to overwrite the
    // payload error in this case? (block-level validation error message)

    return `Only 1 ${onlyAllowedOnceBlockCount[0].blockType} is allowed`;
  }

  return true;
};

/*

SINGLE:
-------

value: (currently added blocks)
onlyAllowedOnceBlockTypes: D, E, F

valid, if value contains A, B, C, D, E, F.
invalid, if value contains A, B, C, D, E, F, D.

*/

export const validateUniqueBlocksSingle = ({
  onlyAllowedOnceBlockTypes,
}: {
  onlyAllowedOnceBlockTypes: string[];
}) => (value: unknown): true | string => {
  if (!Array.isArray(value)) {
    return true;
  }

  const nonUniqueBlockTypes: string[] = [];

  onlyAllowedOnceBlockTypes.forEach((onlyAllowedOnceBlockType) => {
    const onlyAllowedOnceBlockCount = value.filter((block) => {
      const isBlock = block && typeof block === 'object' && 'blockType' in block;

      if (!isBlock) {
        return false;
      }

      if (onlyAllowedOnceBlockType === block.blockType) {
        return true;
      }

      return false;
    });

    if (onlyAllowedOnceBlockCount.length > 1) {
      nonUniqueBlockTypes.push(onlyAllowedOnceBlockType);
    }

  });

  if (nonUniqueBlockTypes.length > 0) {
    // TODO: this is not working. Seems not possible to overwrite the
    // payload error in this case? (block-level validation error message)

    return `Only 1 ${nonUniqueBlockTypes[0]} is allowed`;
  }

  return true;
};

