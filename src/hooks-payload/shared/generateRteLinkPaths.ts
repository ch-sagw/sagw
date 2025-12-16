import type {
  BasePayload, CollectionSlug,
} from 'payload';
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import { addLinkReference } from './addLinkReference';
import { singletonSlugs } from '@/collections/Pages/pages';
import { generateSingletonUrls } from './generateSingletonUrls';
import type { InterfacePageUrls } from '@/payload-types';
import { getRootPathUrls } from './getRootPathUrls';

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
  currentPageId?: string;
}

// Recursively processes RTE lexical nodes to find internal links
// and add URL paths from the Links collection

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

        const isSingleton = relationTo && singletonSlugs.some((singleton) => singleton.slug === relationTo);

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

        let urls: InterfacePageUrls | null = null;

        if (linkDoc.docs.length === 0 && isSingleton && relationTo) {
          urls = await generateSingletonUrls(
            payload,
            relationTo as CollectionSlug,
            documentId,
          );
        } else if (linkDoc.docs.length > 0) {
          const [link] = linkDoc.docs;

          if (!link.deleted && link.url) {
            urls = {
              de: link.url.de || null,
              en: link.url.en || null,
              fr: link.url.fr || null,
              it: link.url.it || null,
            };
          } else if (link.deleted) {
            urls = getRootPathUrls();
          }
        } else {
          urls = getRootPathUrls();
        }

        if (!urls) {
          const processedChildren = linkNode.children
            ? await Promise.all(linkNode.children.map(processNode))
            : linkNode.children;

          return {
            ...linkNode,
            children: processedChildren,
          };
        }

        if (currentPageId && !isSingleton && linkDoc.docs.length > 0) {
          const [link] = linkDoc.docs;

          if (!link.deleted) {
            await addLinkReference({
              linkDocument: link,
              payload,
              referencingPageId: currentPageId,
              targetPageId: documentId as string,
            });
          }
        }

        // Add URL to link node
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

