import {
  CollectionBeforeValidateHook, ValidationError,
} from 'payload';
import { InterfaceInternalLinkValue } from '@/payload-types';
import { fieldParentSelectorFieldName } from '@/field-templates/parentSelector';

// Recursively check if a page would create a circular reference
const checkCircularReference = async (
  payload: any,
  currentDocumentId: string | undefined,
  targetCollectionSlug: string,
  targetDocumentId: string,
  visited: Set<string> = new Set(),
): Promise<boolean> => {
  // If we're trying to reference ourselves, it's circular
  if (currentDocumentId && currentDocumentId === targetDocumentId) {
    return true;
  }

  // If we've already visited this node, we have a cycle
  if (visited.has(targetDocumentId)) {
    return true;
  }

  visited.add(targetDocumentId);

  try {
    // Fetch the target document to check its parent
    const targetDoc = await payload.findByID({
      collection: targetCollectionSlug,
      depth: 0,
      id: targetDocumentId,
    });

    if (!(fieldParentSelectorFieldName in targetDoc)) {
      return false;
    }

    const targetParentRef = targetDoc[fieldParentSelectorFieldName] as InterfaceInternalLinkValue;

    if (!targetParentRef) {
      return false;
    }

    // Recursively check the parent chain
    return checkCircularReference(
      payload,
      currentDocumentId,
      targetParentRef.slug,
      targetParentRef.documentId,
      visited,
    );
  } catch {
    // If document doesn't exist or other error, assume no circular reference
    // (validation will fail elsewhere)
    return false;
  }
};

export const hookValidateParentCircularReference: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only validate on create or update
  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  if (!data || !req?.payload) {
    return data;
  }

  const parentRef = data[fieldParentSelectorFieldName] as InterfaceInternalLinkValue | undefined;

  // If no parent is set, no validation needed
  if (!parentRef) {
    return data;
  }

  const currentDocumentId = originalDoc?.id || data.id;

  // Check for circular reference
  const hasCircularReference = await checkCircularReference(
    req.payload,
    currentDocumentId,
    parentRef.slug,
    parentRef.documentId,
  );

  if (hasCircularReference) {
    throw new ValidationError({
      errors: [
        {
          message: 'Cannot set parent page because it would create a circular reference. This page or one of its ancestors is already a descendant of the current page.',
          path: fieldParentSelectorFieldName,
        },
      ],
    });
  }

  return data;
};

