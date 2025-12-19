import { InterfaceRte } from '@/components/base/types/rte';
import {
  convertLexicalToHTML, HTMLConvertersFunction,
  LinkHTMLConverter as linkHTMLConverter,
} from '@payloadcms/richtext-lexical/html';
import {
  SerializedSoftHyphenNode, softHyphenJSXConverter,
} from '@/components/admin/rte/features/SoftHyphen/SoftHyphenNode';
import {
  nonBreakingSpaceJSXConverter, SerializedNonBreakingSpaceNode,
} from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpaceNode';
import {
  DefaultNodeTypes, SerializedLinkNode,
} from '@payloadcms/richtext-lexical';
import {
  SerializedParagraphNode, SerializedTextNode,
} from '@payloadcms/richtext-lexical/lexical';
import type { BasePayload } from 'payload';
import type { Config } from '@/payload-types';
import { getPageUrl } from './getPageUrl';
import { getRootPathUrls } from '@/hooks-payload/shared/getRootPathUrls';

import { externalLink } from '@/icons/ui/external-link';

// Union type for all possible lexical nodes
type LexicalNode =
  | SerializedTextNode
  | SerializedLinkNode
  | SerializedParagraphNode
  | SerializedSoftHyphenNode
  | SerializedNonBreakingSpaceNode
  | { type: string; children?: LexicalNode[]; version: number; [key: string]: unknown };

const createInternalDocToHref = (linkUrlMap: Map<string, string>) => ({
  linkNode,
}: { linkNode: SerializedLinkNode }): string => {
  if (!linkNode.fields.doc) {
    return '';
  }

  const {
    value,
  } = linkNode.fields.doc;

  let foundDocumentId: string | null = null;

  if (value && typeof value === 'object') {
    const objValue = value as Record<string, unknown>;

    if ('id' in objValue && typeof objValue.id === 'string') {
      foundDocumentId = objValue.id;
    }
  }

  // Check if we have a computed URL for this documentId
  if (foundDocumentId) {
    const computedUrl = linkUrlMap.get(foundDocumentId);

    if (computedUrl && typeof computedUrl === 'string') {
      return computedUrl;
    }
  }

  // Last resort fallback
  if (foundDocumentId) {
    return `/${foundDocumentId}`;
  }

  return '';
};

const createHtmlConverters = ({
  wrap,
  includeLinks,
  linkUrlMap,
}: {
  wrap: boolean | undefined;
  includeLinks: boolean;
  linkUrlMap: Map<string, string>;
}): HTMLConvertersFunction<DefaultNodeTypes> => ({
  defaultConverters,
}) => {
  const baseConverters = {
    ...defaultConverters,
    ...(includeLinks
      ? linkHTMLConverter({
        internalDocToHref: createInternalDocToHref(linkUrlMap),
      })
      : {}),
    ...softHyphenJSXConverter,
    ...nonBreakingSpaceJSXConverter,
  };

  if (!wrap) {
    baseConverters.paragraph = ({
      node,
      converters,
    }): string => {

      // Recursively render the paragraph’s children without wrapping <p> !
      const paragraphNode = node as SerializedParagraphNode;

      // Recursively render children using convertLexicalToHTML,
      // but with disableContainer = true to avoid <div> wrappers.
      const childrenHtml = paragraphNode.children
        .map((child) => convertLexicalToHTML({
          converters: () => converters,
          data: {
            root: {
              children: [child],
              direction: null,
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
          disableContainer: true,
        }))
        .join('');

      return childrenHtml;
    };
  }

  return baseConverters;
};

// Recursively process lexical nodes to add icons to links
// and convert quotes to guillemets
const processLexicalNodes = (nodes: LexicalNode[]): LexicalNode[] => nodes.map((node) => {
  // Process link nodes to add icons
  if (node.type === 'link') {
    const linkNode = node as SerializedLinkNode;
    const processedChildren = processLexicalNodes(linkNode.children || []);
    const hasExternalLink = linkNode.fields?.newTab === true;

    // Add external link icon as a new text node if needed
    if (hasExternalLink) {
      const iconNode: SerializedTextNode = {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: externalLink,
        type: 'text',
        version: 1,
      };

      return {
        ...linkNode,
        children: [
          ...processedChildren,
          iconNode,
        ],
      };
    }

    return {
      ...linkNode,
      children: processedChildren,
    };
  }

  // Process text nodes to convert quotes to guillemets
  if (node.type === 'text') {
    const textNode = node as SerializedTextNode;

    if (textNode.text) {
      return {
        ...textNode,
        text: textNode.text.replace(/"(?<capGroup1>[^"]+)"/gu, '«$1»'),
      };
    }

    return textNode;
  }

  // Recursively process children for other node types
  if ('children' in node && node.children) {
    return {
      ...node,
      children: processLexicalNodes(node.children),
    };
  }

  return node;
});

interface InterfaceRteToHtmlProps {
  content: InterfaceRte | undefined | null;
  wrap?: boolean;
  includeLinks?: boolean;
  linkUrlMap?: Map<string, string>;
}

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

const rteToHtmlBase = ({
  content,
  wrap,
  includeLinks = false,
  linkUrlMap = new Map(),
}: InterfaceRteToHtmlProps): string => {
  if (!content) {
    return '';
  }

  // Process the lexical data structure to add icons and convert quotes
  const processedContent: InterfaceRte = {
    root: {
      ...content.root,
      children: processLexicalNodes(content.root.children) as any,
    },
  };

  const htmlConverters = createHtmlConverters({
    includeLinks,
    linkUrlMap,
    wrap: wrap ?? false,
  });

  const transformedData = convertLexicalToHTML({
    converters: htmlConverters,
    data: processedContent,
    disableContainer: true,
  });

  return transformedData;
};

/*
Requirement: Rte4 is the only rte config which allows true paragraphing.

Problem: e.g. input label text is rte1. Paragraphs don't make sense there.
But still, payload allows to add paragraphs in lexical field. We can't disable
it unless we build a complete custom lexical implementation on ourselves.

Solution:
- For Rte1, Rte2 and Rte3, we join the paragraph nodes and therefore removing
them completely. This is done by setting `wrap: false`.
- For Rte4, we want paragraphs, therefore we skip the join process. This is
done by setting `wrap: true`.
*/

export const rteToHtml = (content: InterfaceRte | undefined | null): string => rteToHtmlBase({
  content,
  includeLinks: false,
  linkUrlMap: new Map(),
  wrap: false,
});

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
