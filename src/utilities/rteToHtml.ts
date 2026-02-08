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
import { mail } from '@/icons/ui/mail';
import slugify from 'slugify';

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

    // custom heading converter to include id attribute
    heading: ({
      node,
      converters,
    }: {
      node: { tag: string; id?: string; children?: LexicalNode[]; [key: string]: unknown };
      converters: ReturnType<HTMLConvertersFunction<DefaultNodeTypes>>;
    }): string => {
      const headingNode = node as { tag: string; id?: string; children?: LexicalNode[] };
      const tag = headingNode.tag || 'h2';
      const id = headingNode.id
        ? ` id="${headingNode.id}"`
        : '';

      // use default converter to render children
      const childrenHtml = headingNode.children
        ? headingNode.children
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
          .join('')
        : '';

      return `<${tag}${id}>${childrenHtml}</${tag}>`;
    },
  };

  if (!wrap) {
    baseConverters.paragraph = ({
      node,
      converters,
    }): string => {

      // recursively render the paragraph’s children without wrapping <p> !
      const paragraphNode = node as SerializedParagraphNode;

      // recursively render children using convertLexicalToHTML,
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

// extract text content from a node recursively
// (for headings that may contain links, bold, etc.)
const extractTextFromNode = (node: LexicalNode): string => {
  if (node.type === 'text') {
    const textNode = node as SerializedTextNode;

    return textNode.text || '';
  }

  if ('children' in node && node.children) {
    return node.children.map(extractTextFromNode)
      .join('');
  }

  return '';
};

// Recursively process lexical nodes to:
// - add icons to links
// - convert quotes to guillemets
// - transform headings one level up (h1→h2, h2→h3, etc.)
// - add unique IDs to headings
const processLexicalNodes = (
  nodes: LexicalNode[],
  idTracker: Map<string, number> = new Map(),
): LexicalNode[] => nodes.map((node) => {
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

    // extract text from heading to generate ID (before processing children)
    const headingText = extractTextFromNode(node);
    const baseSlug = slugify(headingText, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Process children recursively
    const processedChildren = 'children' in node && node.children
      ? processLexicalNodes(node.children, idTracker)
      : node.children;

    // generate unique id by appending number if needed
    // skip id generation if slug is empty (heading has no text)
    let uniqueId: string | undefined;

    if (baseSlug) {
      if (idTracker.has(baseSlug)) {
        const count = (idTracker.get(baseSlug) || 0) + 1;

        idTracker.set(baseSlug, count);
        uniqueId = `${baseSlug}-${count}`;
      } else {
        idTracker.set(baseSlug, 0);
        uniqueId = baseSlug;
      }
    }

    return {
      ...node,
      children: processedChildren,
      tag: newTag,
      ...(uniqueId && {
        id: uniqueId,
      }),
    };
  }

  // Process link nodes to add icons
  if (node.type === 'link' || node.type === 'autolink') {
    const linkNode = node as SerializedLinkNode;
    const processedChildren = processLexicalNodes(linkNode.children || [], idTracker);
    const hasExternalLink = linkNode.fields?.newTab === true;
    const hasMailToLink = linkNode.fields?.url?.includes('mailto');

    let icon;

    if (hasExternalLink) {
      icon = externalLink;
    }

    if (hasMailToLink) {
      icon = mail;
    }

    // Add external link icon as a new text node if needed
    if (icon !== undefined) {
      const iconNode: SerializedTextNode = {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: icon,
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
      children: processLexicalNodes(node.children, idTracker),
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
