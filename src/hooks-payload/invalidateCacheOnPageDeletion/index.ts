import type { CollectionBeforeDeleteHook } from 'payload';

// Hook to invalidate cache before a page is deleted
// Runs on page collections' beforeDelete hook
export const hookInvalidateCacheOnPageDeletion: CollectionBeforeDeleteHook = async ({
  id,
  req,
  collection,
  context,
}) => {
  if (!id || !req?.payload) {
    return;
  }

  // Prevent infinite loops
  if (context?.invalidatingCache) {
    return;
  }

  try {
    // Find the corresponding Links document
    const linkDoc = await req.payload.find({
      collection: 'links',
      limit: 1,
      where: {
        documentId: {
          equals: String(id),
        },
      },
    });

    if (linkDoc.docs.length === 0) {
      // No Links document found, nothing to invalidate
      return;
    }

    const link = linkDoc.docs[0] as { id: string | number; references?: { pageId?: string | null }[] };

    // Get all referencing page IDs
    const referencingPageIds = (link.references || [])
      .map((ref) => ref.pageId)
      .filter(Boolean) as string[];

    if (referencingPageIds.length > 0) {
      // TODO: Implement actual cache invalidation using Next.js revalidatePath
      console.log(`[Cache Invalidation] Page ${id} (${collection?.slug}) about to be deleted. Invalidating cache for ${referencingPageIds.length} referencing pages:`, referencingPageIds);
    }
  } catch (error) {
    console.error('Error invalidating cache on page deletion:', error);
  }
};

