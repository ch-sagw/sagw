import type {
  BasePayload, TypedLocale,
} from 'payload';
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import { extractProgrammaticLinkIds } from './extractProgrammaticLinkIds';

type LexicalNode =
  | SerializedLinkNode
  | { type: string; children?: LexicalNode[]; version: number; [key: string]: unknown };

const isInternalLinkObject = (obj: unknown): boolean => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return '_internalLinkMarker' in obj && obj._internalLinkMarker === true;
};

const getInternalLinkDocumentId = (obj: unknown): string | null => {
  if (isInternalLinkObject(obj)) {
    const internalLink = obj as { slug: string; documentId: string };

    if (internalLink.documentId) {
      return internalLink.documentId;
    }
  }

  return null;
};

// recursively extracts all RTE internal link documentIds from rte content
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

      // check if it's an internal link
      if (linkNode.fields?.linkType === 'internal' && linkNode.fields?.doc?.value) {
        const documentIdValue = linkNode.fields.doc.value;
        let documentId: string | null = null;

        if (typeof documentIdValue === 'string') {
          documentId = documentIdValue;
        } else if (documentIdValue && typeof documentIdValue === 'object') {
          // Handle object value (e.g., { documentId: '...', slug: '...' })
          const docValueObj = documentIdValue as Record<string, unknown>;
          const {
            documentId: docId,
            id,
            value,
          } = docValueObj;

          if (docId && typeof docId === 'string') {
            documentId = docId;
          } else if (id && typeof id === 'string') {
            documentId = id;
          } else if (value && typeof value === 'string') {
            documentId = value;
          }
        }

        if (documentId) {
          linkIds.add(documentId);
        }
      }
    }

    // process children recursively
    if ('children' in node && node.children) {
      node.children.forEach(processNode);
    }
  };

  root.children.forEach(processNode);

  return linkIds;
};

// recursively extracts all internalLink documentIds from a document
const extractInternalLinkIds = (obj: unknown, linkIds: Set<string> = new Set()): Set<string> => {
  if (!obj || typeof obj !== 'object') {
    return linkIds;
  }

  const documentId = getInternalLinkDocumentId(obj);

  if (documentId) {
    linkIds.add(documentId);
  }

  // recursively process arrays
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      extractInternalLinkIds(item, linkIds);
    });
  } else {
    // recursively process object properties
    Object.keys(obj)
      .forEach((key) => {
        // skip certain fields that shouldn't be processed
        if (key !== 'id' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '_status' && key !== 'parentPage') {
          extractInternalLinkIds((obj as Record<string, unknown>)[key], linkIds);
        }
      });
  }

  return linkIds;
};

// recursively extracts all RTE link IDs from the entire document structure
const extractRteLinkIdsFromDocument = (obj: unknown, linkIds: Set<string> = new Set()): Set<string> => {
  if (!obj || typeof obj !== 'object') {
    return linkIds;
  }

  const objRecord = obj as Record<string, unknown>;

  // check if this is RTE content
  if (objRecord.root && typeof objRecord.root === 'object') {
    const root = objRecord.root as { children?: unknown[] };

    if (root.children && Array.isArray(root.children)) {
      extractRteLinkIds(objRecord, linkIds);
    }
  }

  // recursively process arrays
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      extractRteLinkIdsFromDocument(item, linkIds);
    });
  } else {
    // recursively process object properties
    Object.keys(objRecord)
      .forEach((key) => {
      // skip certain fields that shouldn't be processed
        if (key !== 'id' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '_status' && key !== 'parentPage') {
          extractRteLinkIdsFromDocument(objRecord[key], linkIds);
        }
      });
  }

  return linkIds;
};

interface InterfaceExtractAllLinkIdsParams {
  doc: Record<string, unknown>;
  context?: {
    payload: BasePayload;
    tenant?: string;
    locale?: TypedLocale;
    currentPageId?: string;
    collectionSlug?: string;
  };
}

export const extractAllLinkIds = async ({
  doc,
  context,
}: InterfaceExtractAllLinkIdsParams): Promise<Set<string>> => {
  const allLinkIds = new Set<string>();

  extractInternalLinkIds(doc, allLinkIds);
  extractRteLinkIdsFromDocument(doc, allLinkIds);

  // Extract programmatic links from blocks
  if (context) {
    const programmaticLinkIds = await extractProgrammaticLinkIds(doc, context);

    programmaticLinkIds.forEach((linkId) => {
      allLinkIds.add(linkId);
    });
  }

  return allLinkIds;
};
