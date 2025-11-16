import {
  CollectionBeforeValidateHook, ValidationError,
} from 'payload';
import { isTranslator } from '@/collections/Plc/Users/roles';

/**
 * Translator role needs special treatment. While we can prevent them from
 * adding blocks via "Add Content" button, this is not working if a translator
 * clicks on "..." next to a block. There, he still can add, delete, duplicate,
 * reorder.
 *
 * Furthermore, we can not use access control for this, since denying updating
 * alltogether would also prevent them from editing fields.
 */
export const hookPreventBlockStructureChangesForTranslators = (): CollectionBeforeValidateHook => ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update' || !isTranslator(req) || !originalDoc) {
    return data;
  }

  const fieldName = 'content';
  let newBlocks = data?.[fieldName];

  // all blocks are inside the content field, except for the event detail page
  if (!newBlocks || newBlocks.length < 1) {
    newBlocks = data?.['blocks'][fieldName];
  }

  let originalBlocks = originalDoc?.[fieldName];

  if (!originalBlocks || originalBlocks.length < 1) {
    originalBlocks = originalDoc?.['blocks'][fieldName];
  }

  if (!newBlocks || !originalBlocks) {
    return data;
  }

  if (!Array.isArray(newBlocks) || !Array.isArray(originalBlocks)) {
    return data;
  }

  if (originalBlocks.length === 0) {
    return data;
  }

  const countDifference = newBlocks.length - originalBlocks.length;

  if (countDifference > 0) {
    throw new ValidationError({
      errors: [
        {
          message: 'You are not allowed to add, delete, duplicate, or reorder blocks. You can only edit the content within existing blocks.',
          path: fieldName,
        },
      ],
    });
  }

  if (countDifference < 0) {
    throw new ValidationError({
      errors: [
        {
          message: 'You are not allowed to add, delete, duplicate, or reorder blocks. You can only edit the content within existing blocks.',
          path: fieldName,
        },
      ],
    });
  }

  // Count is the same - check for reordering
  const orderChanged = newBlocks.some((block: any, index: number) => {
    const originalBlock = originalBlocks[index];

    if (!originalBlock) {
      return false;
    }

    // First try to compare by ID (most reliable for detecting reordering)
    // When blocks are reordered, IDs stay the same but positions change
    const newBlockId = block?.id;
    const originalBlockId = originalBlock?.id;

    if (newBlockId && originalBlockId) {
      // If IDs don't match at this position, blocks were reordered
      return newBlockId !== originalBlockId;
    }

    // If no IDs available, fall back to comparing block types
    // This is less reliable but better than nothing
    return block?.blockType !== originalBlock?.blockType;
  });

  if (orderChanged) {
    throw new ValidationError({
      errors: [
        {
          message: 'You are not allowed to add, delete, duplicate, or reorder blocks. You can only edit the content within existing blocks.',
          path: fieldName,
        },
      ],
    });
  }

  return data;
};

