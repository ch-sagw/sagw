import type { BasePayload } from 'payload';
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import { addLinkReference } from './addLinkReference';
import { singletonSlugs } from '@/collections/Pages/pages';

// Union type for all possible lexical nodes
type LexicalNode =
  | SerializedLinkNode
  | { type: string; children?: LexicalNode[]; version: number; [key: string]: unknown };

interface InterfaceGenerateRteLinkPathsParams {
  rteContent: {
    root?: {
      children?: LexicalNode[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  } | null | undefined;
  payload: BasePayload;
  currentPageId: string;
}

/**
 * Recursively processes RTE lexical nodes to find internal links
 * and add URL paths from the Links collection
 */
export const generateRteLinkPaths = async ({
  rteContent,
  payload,
  currentPageId,
}: InterfaceGenerateRteLinkPathsParams): Promise<typeof rteContent> => {
  if (!rteContent || !rteContent.root) {
    return rteContent;
  }

  const processNode = async (node: LexicalNode): Promise<LexicalNode> => {
    // Process link nodes
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

        if (!documentId) {
          // Invalid documentId, process children and return
          const processedChildren = linkNode.children
            ? await Promise.all(linkNode.children.map(processNode))
            : linkNode.children;

          return {
            ...linkNode,
            children: processedChildren,
          };
        }

        // Check if target page is a singleton
        const isSingleton = relationTo && singletonSlugs.some((singleton) => singleton.slug === relationTo);

        if (isSingleton) {
          // For singletons, skip URL resolution and reference tracking
          // but still process children
          const processedChildren = linkNode.children
            ? await Promise.all(linkNode.children.map(processNode))
            : linkNode.children;

          return {
            ...linkNode,
            children: processedChildren,
          };
        }

        // Fetch link document once
        const linkDoc = await payload.find({
          collection: 'links',
          limit: 1,
          where: {
            and: [
              {
                documentId: {
                  equals: documentId,
                },
              },
            ],
          },
        });

        if (linkDoc.docs.length === 0) {
          // No link document found, process children and return
          const processedChildren = linkNode.children
            ? await Promise.all(linkNode.children.map(processNode))
            : linkNode.children;

          return {
            ...linkNode,
            children: processedChildren,
          };
        }

        const [link] = linkDoc.docs;

        // Extract URLs if link is not deleted
        let urls = null;

        if (!link.deleted && link.url) {
          urls = {
            de: link.url.de || null,
            en: link.url.en || null,
            fr: link.url.fr || null,
            it: link.url.it || null,
          };
        }

        // Add reference to target page
        await addLinkReference({
          linkDocument: link,
          payload,
          referencingPageId: currentPageId,
          targetPageId: documentId as string,
        });

        // Add URL to link node
        // Store in custom field 'internalUrl' to avoid conflict with Payload's
        // 'url' field
        // which expects a string for external links
        const updatedNode: SerializedLinkNode = {
          ...linkNode,
          fields: {
            ...linkNode.fields,
            internalUrl: urls,
          } as SerializedLinkNode['fields'] & { internalUrl?: typeof urls },
        };

        // Process children recursively
        if (linkNode.children) {
          updatedNode.children = await Promise.all(linkNode.children.map(processNode));
        }

        return updatedNode;

      }

      // Process children for non-internal links
      if (linkNode.children) {
        return {
          ...linkNode,
          children: await Promise.all(linkNode.children.map(processNode)),
        };
      }

      return linkNode;
    }

    // Process other nodes with children recursively
    if ('children' in node && node.children) {
      return {
        ...node,
        children: await Promise.all(node.children.map(processNode)),
      };
    }

    return node;
  };

  // Process root children
  if (rteContent.root.children) {
    const processedChildren = await Promise.all(rteContent.root.children.map(processNode));

    return {
      ...rteContent,
      root: {
        ...rteContent.root,
        children: processedChildren,
      },
    };
  }

  return rteContent;
};
