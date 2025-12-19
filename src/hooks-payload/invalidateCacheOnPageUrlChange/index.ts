import type { CollectionAfterChangeHook } from 'payload';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';

// Hook to invalidate cache when a page's URL changes (slug or breadcrumb)
// or when page is unpublished
// Runs on page collections' afterChange hook
export const hookInvalidateCacheOnPageUrlChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  context,
  collection,
}) => {
  if (!doc || !req?.payload || operation !== 'update' || !previousDoc) {
    return doc;
  }

  // Prevent infinite loops
  if (context?.invalidatingCache || context?.regeneratingLinks) {
    return doc;
  }

  const docId = doc.id;

  if (!docId) {
    return doc;
  }

  const isPublished = doc._status === 'published';
  const wasPublished = previousDoc._status === 'published';
  const isUnpublishing = wasPublished && !isPublished;

  // Check if slug or breadcrumb changed
  const oldSlug = previousDoc.slug;
  const newSlug = doc.slug;
  const slugChanged = JSON.stringify(oldSlug) !== JSON.stringify(newSlug);

  const oldBreadcrumb = previousDoc[fieldBreadcrumbFieldName];
  const newBreadcrumb = doc[fieldBreadcrumbFieldName];
  const breadcrumbChanged = JSON.stringify(oldBreadcrumb) !== JSON.stringify(newBreadcrumb);

  // If page is being unpublished, invalidate cache for references
  if (isUnpublishing) {
    try {
      // Find the corresponding Links document
      const linkDoc = await req.payload.find({
        collection: 'links',
        limit: 1,
        where: {
          documentId: {
            equals: String(docId),
          },
        },
      });

      if (linkDoc.docs.length > 0) {
        const link = linkDoc.docs[0] as { id: string | number; references?: { pageId?: string | null }[] };
        const referencingPageIds = (link.references || [])
          .map((ref) => ref.pageId)
          .filter(Boolean) as string[];

        if (referencingPageIds.length > 0) {
          // TODO: Implement actual cache invalidation using
          // Next.js revalidatePath
          console.log(`[Cache Invalidation] Page ${docId} (${collection?.slug}) unpublished. Invalidating cache for ${referencingPageIds.length} referencing pages:`, referencingPageIds);
        }
      }
    } catch (error) {
      console.error('Error invalidating cache on page unpublish:', error);
    }
  }

  // If nothing changed, no need to invalidate cache
  if (!slugChanged && !breadcrumbChanged) {
    return doc;
  }

  try {
    const linkDocId = doc.id;

    if (!linkDocId) {
      return doc;
    }

    // Find the corresponding Links document
    const linkDoc = await req.payload.find({
      collection: 'links',
      limit: 1,
      where: {
        documentId: {
          equals: String(linkDocId),
        },
      },
    });

    if (linkDoc.docs.length === 0) {
      // No Links document found, nothing to invalidate
      return doc;
    }

    const link = linkDoc.docs[0] as { id: string | number; references?: { pageId?: string | null }[] };

    // Get all referencing page IDs
    const referencingPageIds = (link.references || [])
      .map((ref) => ref.pageId)
      .filter(Boolean) as string[];

    if (referencingPageIds.length === 0) {
      // No references, nothing to invalidate
      return doc;
    }

    // TODO: Implement actual cache invalidation using Next.js revalidatePath
    // For now, log the pages that need cache invalidation
    console.log(`[Cache Invalidation] URL changed for page ${linkDocId} (${collection?.slug}). Invalidating cache for ${referencingPageIds.length} referencing pages:`, referencingPageIds);

    // TODO: Replace with actual cache invalidation
    // await Promise.all(referencingPageIds.map((pageId) => {
    //   return invalidatePageCache(pageId);
    // }));
  } catch (error) {
    console.error('Error invalidating cache on page URL change:', error);
  }

  return doc;
};

