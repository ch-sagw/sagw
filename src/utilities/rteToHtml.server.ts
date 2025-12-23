import 'server-only';
import { InterfaceRte } from '@/components/base/types/rte';
import type { BasePayload } from 'payload';
import type { Config } from '@/payload-types';
import { getPageUrl } from './getPageUrl';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';
import { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import { SerializedTextNode } from '@payloadcms/richtext-lexical/lexical';
import { rteToHtmlBase } from './rteToHtml';

// Union type for all possible lexical nodes
type LexicalNode =
  | SerializedTextNode
  | SerializedLinkNode
  | { type: string; children?: LexicalNode[]; version: number; [key: string]: unknown };

// Recursively finds all internal link documentIds in RTE content
const findInternalLinkIds = (nodes: LexicalNode[]): string[] => {
  const linkIds: string[] = [];

  if (!nodes || nodes.length === 0) {
    return linkIds;
  }

  const processNode = (node: LexicalNode): void => {
    if (node.type === 'link') {
      const linkNode = node as SerializedLinkNode;

      if (linkNode.fields?.linkType === 'internal' && linkNode.fields?.doc) {
        const {
          value,
        } = linkNode.fields.doc;

        let foundDocumentId: string | null = null;

        if (typeof value === 'string') {
          foundDocumentId = value;
        } else if (value && typeof value === 'object') {
          const objValue = value as Record<string, unknown>;

          // The value is the full page document object, extract the id
          if ('id' in objValue && typeof objValue.id === 'string') {
            foundDocumentId = objValue.id;
          } else if ('documentId' in objValue && typeof objValue.documentId === 'string') {
            foundDocumentId = objValue.documentId;
          }
        }

        if (foundDocumentId) {
          linkIds.push(foundDocumentId);
        }
      }
    }

    if ('children' in node && node.children) {
      node.children.forEach(processNode);
    }
  };

  nodes.forEach(processNode);

  return linkIds;
};

// Abstract method for rte3ToHtml and rte4ToHtml to deduplicate code
const rteToHtmlWithLinks = async ({
  content,
  payload,
  locale,
  wrap,
}: {
  content: InterfaceRte | undefined | null;
  payload: BasePayload;
  locale: Config['locale'];
  wrap: boolean;
}): Promise<string> => {
  if (!content) {
    return '';
  }

  // Create a new URL map for this request
  const linkUrlMap = new Map<string, string>();

  // Find all internal link documentIds
  const linkIds = findInternalLinkIds(content.root.children);

  // Compute URLs for all internal links
  if (linkIds.length > 0) {
    await Promise.all(linkIds.map(async (documentId) => {
      try {
        const url = await getPageUrl({
          locale,
          pageId: documentId,
          payload,
        });

        // getPageUrl should always return a string, but ensure it's a string
        if (typeof url === 'string') {
          linkUrlMap.set(documentId, url);
        } else {
          // Fallback if somehow we got an object
          linkUrlMap.set(documentId, getRootPathUrls()[locale] || '/de/');
        }
      } catch (error) {
        console.error(`Error computing URL for RTE link ${documentId}:`, error);
        // Fallback URL
        linkUrlMap.set(documentId, getRootPathUrls()[locale] || '/de/');
      }
    }));
  }

  // Render with computed URLs and links enabled
  return rteToHtmlBase({
    content,
    includeLinks: true,
    linkUrlMap,
    wrap,
  });
};

export const rte3ToHtml = ({
  content,
  payload,
  locale,
}: {
  content: InterfaceRte | undefined | null;
  payload: BasePayload;
  locale: Config['locale'];
}): Promise<string> => rteToHtmlWithLinks({
  content,
  locale,
  payload,
  wrap: false,
});

export const rte4ToHtml = ({
  content,
  payload,
  locale,
}: {
  content: InterfaceRte | undefined | null;
  payload: BasePayload;
  locale: Config['locale'];
}): Promise<string> => rteToHtmlWithLinks({
  content,
  locale,
  payload,
  wrap: true,
});
