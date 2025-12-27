import { getPayloadCached } from '@/utilities/getPayloadCached';
import { updateLinkReferencesInDatabase } from '@/hooks-payload/shared/updateLinkReferencesInDatabase';

interface InterfaceUpdateLinkReferencesParams {
  docId: string;
  linkIds: Set<string> | string[];
}

// Updates link references in the Links collection for header
// NOTE: this happens during render time, thus we can not reuse the logic
// from updateLinkReferences hook.

export const updateLinkReferences = async ({
  docId,
  linkIds,
}: InterfaceUpdateLinkReferencesParams): Promise<void> => {
  if (!docId || !linkIds) {
    return;
  }

  try {
    const payload = await getPayloadCached();

    // Normalize current link IDs
    const currentLinkIds = new Set(Array.from(linkIds)
      .map((linkId) => {
        // handle case where linkId might be an object with an id field
        if (typeof linkId === 'object' && linkId !== null && 'id' in linkId) {
          const objWithId = linkId as { id: unknown };

          return String(objWithId.id);
        }

        // handle case where linkId might be an object with a documentId field
        if (typeof linkId === 'object' && linkId !== null && 'documentId' in linkId) {
          const objWithDocumentId = linkId as { documentId: unknown };

          return String(objWithDocumentId.documentId);
        }

        return String(linkId);
      }));

    await updateLinkReferencesInDatabase({
      currentLinkIds,
      docId,
      payload,
    });
  } catch (error) {
    console.error('Error updating link references:', error);
  }
};

