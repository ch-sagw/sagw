import type {
  BasePayload, CollectionSlug,
} from 'payload';
import { linkableSlugs } from '@/collections/Pages/pages';

interface InterfaceFindDocumentResult {
  collection: CollectionSlug;
  document: Record<string, unknown>;
}

// Finds a document by ID across all linkable collections
// Returns the collection slug and document if found, null otherwise

export const findDocumentInLinkableCollections = async (
  payload: BasePayload,
  pageId: string,
): Promise<InterfaceFindDocumentResult | null> => {
  const results = await Promise.allSettled(linkableSlugs.map(async (linkableSlug) => {
    const doc = await payload.findByID({
      collection: linkableSlug.slug,
      id: pageId,
    });

    if (doc) {
      return {
        collection: linkableSlug.slug,
        document: doc as unknown as Record<string, unknown>,
      };
    }

    return null;
  }));

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      return result.value;
    }
  }

  return null;
};

