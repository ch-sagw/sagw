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

// Recursively process lexical nodes to:
// - add icons to links
// - convert quotes to guillemets
// - transform headings one level up (h1→h2, h2→h3, etc.)
const processLexicalNodes = (nodes: LexicalNode[]): LexicalNode[] => nodes.map((node) => {
  if (node.type === 'heading' && 'tag' in node && typeof node.tag === 'string') {
    const headingTag = node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    const tagMapping: Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5', 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
      h1: 'h2',
      h2: 'h3',
      h3: 'h4',
      h4: 'h5',
      h5: 'h6',
    };

    const newTag = tagMapping[headingTag];

    // Process children recursively
    const processedChildren = 'children' in node && node.children
      ? processLexicalNodes(node.children)
      : node.children;

    return {
      ...node,
      children: processedChildren,
      tag: newTag,
    };
  }

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

export const rteToHtmlBase = ({
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
