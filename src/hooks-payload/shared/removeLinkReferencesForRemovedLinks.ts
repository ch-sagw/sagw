import type { BasePayload } from 'payload';
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import { singletonSlugs } from '@/collections/Pages/pages';
import { INTERNAL_LINK_MARKER_VALUE } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';
import type { InterfaceInternalLinkValue } from '@/payload-types';

// Union type for all possible lexical nodes
type LexicalNode =
  | SerializedLinkNode
  | { type: string; children?: LexicalNode[]; version: number; [key: string]: unknown };

interface InterfaceRemoveLinkReferencesForRemovedLinksParams {
  originalDoc: Record<string, unknown>;
  currentDoc: Record<string, unknown>;
  currentPageId: string;
  payload: BasePayload;
}

interface InterfaceRemoveLinkReferenceParams {
  linkDocument: {
    id: string;
    references?: ({ pageId?: string | null | undefined })[] | null;
  };
  referencingPageId: string;
  targetPageId: string;
  payload: BasePayload;
}

// Removes a referencing page ID from the target page's references array
// in the Links collection.
const removeLinkReference = async ({
  linkDocument,
  referencingPageId,
  targetPageId,
  payload,
}: InterfaceRemoveLinkReferenceParams): Promise<void> => {
  try {
    const currentReferences = linkDocument.references || [];
    const filteredReferences = currentReferences.filter((ref: { pageId?: string | null | undefined }) => ref.pageId !== referencingPageId);

    if (filteredReferences.length !== currentReferences.length) {
      await payload.update({
        collection: 'links',
        data: {
          references: filteredReferences,
        },
        id: linkDocument.id,
      });
    }
  } catch (error) {
    console.error('Error removing link reference:', error);
    throw new Error(`Cannot remove link reference: Target page ${targetPageId} does not exist in Links collection.`);
  }
};

// Checks if an object is an internalLink object (by checking the marker field)
export const isInternalLinkObject = (obj: unknown): boolean => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const linkObj = obj as Record<string, unknown>;

  return linkObj._internalLinkMarker === INTERNAL_LINK_MARKER_VALUE &&
    typeof linkObj.slug === 'string' &&
    typeof linkObj.documentId === 'string' &&
    Boolean(linkObj.slug) &&
    Boolean(linkObj.documentId);
};

// Checks if an object is a valid internalLink and returns its documentId if
// valid (not a singleton)
export const getInternalLinkDocumentId = (obj: unknown): string | null => {
  if (isInternalLinkObject(obj)) {
    const internalLink = obj as InterfaceInternalLinkValue;

    if (internalLink.documentId) {
      const isSingleton = singletonSlugs.some((singleton) => singleton.slug === internalLink.slug);

      if (!isSingleton) {
        return internalLink.documentId;
      }
    }
  }

  return null;
};

// Recursively extracts all RTE internal link documentIds from RTE content
const extractRteLinkIds = (rteContent: Record<string, unknown>, linkIds: Set<string> = new Set()): Set<string> => {
  if (!rteContent || !rteContent.root || typeof rteContent.root !== 'object') {
    return linkIds;
  }

  const root = rteContent.root as { children?: LexicalNode[] };

  if (!root.children || !Array.isArray(root.children)) {
    return linkIds;
  }

  const processNode = (node: LexicalNode): void => {
    if (node.type === 'link') {
      const linkNode = node as SerializedLinkNode;

      // Check if it's an internal link
      if (linkNode.fields?.linkType === 'internal' && linkNode.fields?.doc?.value) {
        const documentIdValue = linkNode.fields.doc.value;
        const documentId = typeof documentIdValue === 'string'
          ? documentIdValue
          : null;
        const {
          relationTo,
        } = linkNode.fields.doc;

        if (documentId) {
          const isSingleton = relationTo && singletonSlugs.some((singleton) => singleton.slug === relationTo);

          if (!isSingleton) {
            linkIds.add(documentId);
          }
        }
      }
    }

    // Process children recursively
    if ('children' in node && node.children) {
      node.children.forEach(processNode);
    }
  };

  root.children.forEach(processNode);

  return linkIds;
};

// Recursively extracts all internalLink documentIds from a document
const extractInternalLinkIds = (obj: unknown, linkIds: Set<string> = new Set()): Set<string> => {
  if (!obj || typeof obj !== 'object') {
    return linkIds;
  }

  const documentId = getInternalLinkDocumentId(obj);

  if (documentId) {
    linkIds.add(documentId);
  }

  // Recursively process arrays
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      extractInternalLinkIds(item, linkIds);
    });
  } else {
    // Recursively process object properties
    Object.keys(obj)
      .forEach((key) => {
        // Skip certain fields that shouldn't be processed
        if (key !== 'id' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '_status') {
          extractInternalLinkIds((obj as Record<string, unknown>)[key], linkIds);
        }
      });
  }

  return linkIds;
};

// Recursively extracts all RTE link IDs from the entire document structure
const extractRteLinkIdsFromDocument = (obj: unknown, linkIds: Set<string> = new Set()): Set<string> => {
  if (!obj || typeof obj !== 'object') {
    return linkIds;
  }

  const objRecord = obj as Record<string, unknown>;

  // Check if this is RTE content (has root.children structure)
  if (objRecord.root && typeof objRecord.root === 'object') {
    const root = objRecord.root as { children?: unknown[] };

    if (root.children && Array.isArray(root.children)) {
      extractRteLinkIds(objRecord, linkIds);
    }
  }

  // Recursively process arrays
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      extractRteLinkIdsFromDocument(item, linkIds);
    });
  } else {
    // Recursively process object properties
    Object.keys(objRecord)
      .forEach((key) => {
      // Skip certain fields that shouldn't be processed
        if (key !== 'id' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '_status') {
          extractRteLinkIdsFromDocument(objRecord[key], linkIds);
        }
      });
  }

  return linkIds;
};

// Extracts ALL link IDs (both RTE and internalLink) from a document
const extractAllLinkIds = (doc: Record<string, unknown>): Set<string> => {
  const allLinkIds = new Set<string>();

  extractInternalLinkIds(doc, allLinkIds);
  extractRteLinkIdsFromDocument(doc, allLinkIds);

  return allLinkIds;
};

// Removes link references for links that were completely removed
// from the document.
// A link is considered "completely removed" only if it's not present in ANY
// source (neither RTE nor internalLink) in the current document.

export const removeLinkReferencesForRemovedLinks = async ({
  originalDoc,
  currentDoc,
  currentPageId,
  payload,
}: InterfaceRemoveLinkReferencesForRemovedLinksParams): Promise<void> => {
  const originalAllLinkIds = extractAllLinkIds(originalDoc);
  const currentAllLinkIds = extractAllLinkIds(currentDoc);

  // Find links that were completely removed (not present in current doc at all)
  const completelyRemovedLinkIds = new Set(Array.from(originalAllLinkIds)
    .filter((id) => !currentAllLinkIds.has(id)));

  // Remove references for completely removed links
  if (completelyRemovedLinkIds.size > 0) {
    await Promise.all(Array.from(completelyRemovedLinkIds)
      .map(async (targetPageId) => {
        try {
          const linkDoc = await payload.find({
            collection: 'links',
            limit: 1,
            where: {
              and: [
                {
                  documentId: {
                    equals: targetPageId,
                  },
                },
              ],
            },
          });

          if (linkDoc.docs.length > 0) {
            const [link] = linkDoc.docs;

            await removeLinkReference({
              linkDocument: link,
              payload,
              referencingPageId: currentPageId,
              targetPageId,
            });
          }
        } catch (error) {
          console.error(`Error removing reference for completely removed link ${targetPageId}:`, error);
        }
      }));
  }
};

