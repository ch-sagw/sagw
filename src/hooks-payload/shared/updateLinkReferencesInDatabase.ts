// shared utility to update link references in the Links collection
// this is the core logic for adding/removing references that is reused across
// header component, updateLinkReferences hook, and i18nGlobals hook

import type {
  BasePayload, PayloadRequest,
} from 'payload';

interface InterfaceUpdateLinkReferencesInDatabaseParams {
  docId: string;
  currentLinkIds: Set<string>;
  payload: BasePayload;
  context?: Record<string, unknown>;
  req?: PayloadRequest;
}

export const updateLinkReferencesInDatabase = async ({
  docId,
  currentLinkIds,
  payload,
  context,
  req,
}: InterfaceUpdateLinkReferencesInDatabaseParams): Promise<void> => {
  if (!docId || !currentLinkIds) {
    return;
  }

  try {
    // Find links that currently reference this docId
    let linksWithDocRef: { id: string; documentId: string; references: unknown[] }[] = [];

    try {
      const queryResult = await payload.find({
        collection: 'links',
        limit: 0,
        where: {
          'references.pageId': {
            equals: docId,
          },
        },
      });

      linksWithDocRef = queryResult.docs as { id: string; documentId: string; references: unknown[] }[];
    } catch (e) {
      console.error('Error getting Links documents which reference page:', e);

      return;
    }

    // Extract link IDs that currently reference this docId
    const currentlyReferencedLinkIds = new Set(linksWithDocRef.map((link) => link.documentId));

    // Find links that should have references removed
    // (in database but not in current)
    const linksToRemoveRefs = Array.from(currentlyReferencedLinkIds)
      .filter((linkId) => !currentLinkIds.has(linkId));

    // Remove references for links that are no longer referenced
    if (linksToRemoveRefs.length > 0) {
      const linksToRemoveMap = new Map(linksWithDocRef
        .filter((link) => linksToRemoveRefs.includes(link.documentId))
        .map((link) => [
          link.documentId,
          link,
        ]));

      await Promise.all(linksToRemoveRefs.map(async (linkId) => {
        try {
          const linkDoc = linksToRemoveMap.get(linkId);

          if (linkDoc) {
            const existingReferences = (linkDoc.references || []) as { pageId?: string | null }[];

            // Remove reference for this page
            const updatedReferences = existingReferences.filter((ref) => ref.pageId !== docId);

            await payload.update({
              collection: 'links',
              context: {
                ...context,
                updatingLinkReferences: true,
              },
              data: {
                references: updatedReferences,
              },
              id: linkDoc.id,
              ...(req
                ? {
                  req,
                }
                : {}),
            });
          }
        } catch (error) {
          console.error(`Error removing reference for link ${linkId}:`, error);
        }
      }));
    }

    // Add references for newly linked pages
    if (currentLinkIds.size > 0) {
      await Promise.all(Array.from(currentLinkIds)
        .map(async (linkId) => {
          try {
            const linkDoc = await payload.find({
              collection: 'links',
              limit: 1,
              where: {
                documentId: {
                  equals: linkId,
                },
              },
            });

            if (linkDoc.docs.length > 0) {
              const [existingLink] = linkDoc.docs;
              const existingReferences = (existingLink.references || []) as { pageId?: string | null }[];
              const referenceExists = existingReferences.some((ref) => ref.pageId === docId);

              if (!referenceExists) {
                await payload.update({
                  collection: 'links',
                  context: {
                    ...context,
                    updatingLinkReferences: true,
                  },
                  data: {
                    references: [
                      ...existingReferences,
                      {
                        pageId: docId,
                      },
                    ],
                  },
                  id: existingLink.id,
                  ...(req
                    ? {
                      req,
                    }
                    : {}),
                });
              }
            }
          } catch (error) {
            console.error(`Error adding reference for link ${linkId}:`, error);
          }
        }));
    }
  } catch (error) {
    console.error('Error updating link references in database:', error);
  }
};

