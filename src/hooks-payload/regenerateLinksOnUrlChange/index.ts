import type { CollectionAfterChangeHook } from 'payload';
import { findDocumentInLinkableCollections } from '@/hooks-payload/shared/findDocumentInLinkableCollections';
import { clearSystemFields } from '@/hooks-payload/shared/clearSystemFields';

const processingSet = new Set<string>();

interface InterfaceLinkDocument {
  id: string | number;
  url?: Record<string, string | null>;
  deleted?: boolean;
  slug?: string;
  references?: { pageId?: string | null }[];
}

// Hook to regenerate internal links when Links document URL changes
export const hookRegenerateLinksOnUrlChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  context,
}) => {
  if (!doc || !req?.payload || operation !== 'update') {
    return doc;
  }

  if (context?.regeneratingLinks || processingSet.has(String(doc.id))) {
    return doc;
  }

  const linkDoc = doc as InterfaceLinkDocument;

  if (linkDoc.deleted === true) {
    return doc;
  }

  const oldUrl = (previousDoc as InterfaceLinkDocument)?.url;
  const newUrl = linkDoc.url;
  const urlChanged = JSON.stringify(oldUrl) !== JSON.stringify(newUrl);

  if (!urlChanged) {
    return doc;
  }

  const references = linkDoc.references || [];

  if (!Array.isArray(references) || references.length === 0 || !linkDoc.slug) {
    return doc;
  }

  const linkDocumentId = String(linkDoc.id);

  try {
    processingSet.add(linkDocumentId);

    await Promise.all(references.map(async (ref) => {
      const {
        pageId,
      } = ref;

      if (!pageId) {
        return;
      }

      try {
        const result = await findDocumentInLinkableCollections(req.payload, pageId);

        if (!result) {
          return;
        }

        const updateData = clearSystemFields(result.document);

        await req.payload.update({
          collection: result.collection,
          context: {
            ...context,
            regeneratingLinks: true,
          },
          data: updateData as Record<string, unknown>,
          id: pageId,
        });
      } catch (error) {
        console.error(`Error regenerating links for referencing document ${pageId}:`, error);
      }
    }));
  } catch (error) {
    console.error('Error regenerating links on URL change:', error);
  } finally {
    processingSet.delete(linkDocumentId);
  }

  return doc;
};
