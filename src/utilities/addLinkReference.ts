import type { BasePayload } from 'payload';

interface InterfaceAddLinkReferenceParams {
  linkDocument: {
    id: string;
    references?: ({ pageId?: string | null | undefined })[] | null;
  };
  referencingPageId: string;
  targetPageId: string;
  payload: BasePayload;
}

/**
 * Adds a referencing page ID to the target page's references array in the Links
 * collection.
 */
export const addLinkReference = async ({
  linkDocument,
  referencingPageId,
  targetPageId,
  payload,
}: InterfaceAddLinkReferenceParams): Promise<void> => {
  try {
    const currentReferences = linkDocument.references || [];
    const referenceIds = currentReferences
      .map((ref: { pageId?: string | null | undefined }) => ref.pageId)
      .filter((id): id is string => Boolean(id));

    // Only add if not already present
    if (!referenceIds.includes(referencingPageId)) {
      await payload.update({
        collection: 'links',
        data: {
          references: [
            ...currentReferences,
            {
              pageId: referencingPageId,
            },
          ],
        },
        id: linkDocument.id,
      });
    }
  } catch (error) {
    console.error('Error adding link reference:', error);
    throw new Error(`Cannot add link reference: Target page ${targetPageId} does not exist in Links collection. ` +
      'This indicates the page creation hook (hookManageLinksCollectionOnChange) did not run or failed.');
  }
};
