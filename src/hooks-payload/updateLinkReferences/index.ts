// Hook to update references in Links collection when pages are created/updated
// tracks which pages do reference other pages by updating the references array

import type {
  CollectionAfterChangeHook, TypedLocale,
} from 'payload';
import {
  globalCollectionsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { extractAllLinkIds } from '@/hooks-payload/shared/extractAllLinkIds';
import { extractID } from '@/utilities/extractId';

export const hookUpdateLinkReferences: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
  context,
}) => {
  // Prevent infinite loops - if we're already updating link references, skip
  if (context?.updatingLinkReferences) {
    return doc;
  }

  if (!doc || !req?.payload || ![
    'create',
    'update',
  ].includes(operation)) {
    return doc;
  }

  const docId = doc.id;
  const collectionSlug = collection?.slug;

  if (!docId || !collectionSlug) {
    return doc;
  }

  // check if this is a singleton page or a global
  const isSingleton = singletonSlugs.some((singleton) => singleton.slug === collectionSlug);
  const isGlobal = globalCollectionsSlugs.some((global) => global.slug === collectionSlug);
  const isSingletonOrGlobal = isSingleton || isGlobal;

  // for singletons and globals, they're always considered
  // "published" (they don't have _status field)
  // for regular pages, check the _status field
  const isPublished = isSingletonOrGlobal || doc._status === 'published';
  const wasPublished = isSingletonOrGlobal || previousDoc?._status === 'published';
  const isUnpublished = !isSingletonOrGlobal && (doc._status === 'draft' || doc._status === null);
  const isUnpublishing = wasPublished && isUnpublished;

  // only process published pages or when unpublishing (to remove references)
  if (!isPublished && !isUnpublishing) {
    return doc;
  }

  try {
    // Extract tenant and locale for programmatic link extraction
    let tenantId: string | undefined;

    if ('tenant' in doc && doc.tenant) {
      const extractedId = extractID(doc.tenant);

      if (typeof extractedId === 'string') {
        tenantId = extractedId;
      }
    }

    // Get locale from request, fallback to 'de'
    const locale = (req.locale as TypedLocale) || 'de';

    // Prepare context for programmatic link extraction
    const extractionContext = tenantId && req.payload
      ? {
        collectionSlug,
        currentPageId: docId,
        locale,
        payload: req.payload,
        tenant: tenantId,
      }
      : undefined;

    // extract link IDs from current document
    const currentLinkIds = isPublished
      ? await extractAllLinkIds({
        context: extractionContext,
        doc: doc as Record<string, unknown>,
      })
      : new Set<string>();

    // extract link IDs from previous document (if it exists)
    const previousLinkIds = previousDoc
      ? await extractAllLinkIds({
        context: extractionContext,
        doc: previousDoc as Record<string, unknown>,
      })
      : new Set<string>();

    // find links that were added (in current but not in previous)
    const addedLinkIds = new Set<string>();

    currentLinkIds.forEach((linkId) => {
      if (!previousLinkIds.has(linkId)) {
        addedLinkIds.add(linkId);
      }
    });

    // find links that were removed (in previous but not in current)
    const removedLinkIds = new Set<string>();

    previousLinkIds.forEach((linkId) => {
      if (!currentLinkIds.has(linkId)) {
        removedLinkIds.add(linkId);
      }
    });

    // add references for newly linked pages
    if (isPublished && addedLinkIds.size > 0) {
      await Promise.all(Array.from(addedLinkIds)
        .map(async (linkId) => {
          try {
            const linkDoc = await req.payload.find({
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
                await req.payload.update({
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
                  req,
                });
              }
            }
          } catch (error) {
            console.error(`Error adding reference for link ${linkId}:`, error);
          }
        }));
    }

    // remove references for unlinked pages (or when unpublishing)
    if ((isUnpublishing || removedLinkIds.size > 0) && (previousLinkIds.size > 0 || isUnpublishing)) {
      const linkIdsToProcess = isUnpublishing
        ? previousLinkIds
        : removedLinkIds;

      await Promise.all(Array.from(linkIdsToProcess)
        .map(async (linkId) => {
          try {
            const linkDoc = await req.payload.find({
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

              // remove reference for this page
              const updatedReferences = existingReferences.filter((ref) => ref.pageId !== docId);

              await req.payload.update({
                collection: 'links',
                context: {
                  ...context,
                  updatingLinkReferences: true,
                },
                data: {
                  references: updatedReferences,
                },
                id: existingLink.id,
                req,
              });
            }
          } catch (error) {
            console.error(`Error removing reference for link ${linkId}:`, error);
          }
        }));
    }
  } catch (error) {
    console.error('Error updating link references:', error);
  }

  return doc;
};

