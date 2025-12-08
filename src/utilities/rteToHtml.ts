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
import { TypedLocale } from 'payload';

// Union type for all possible lexical nodes
type LexicalNode =
  | SerializedTextNode
  | SerializedLinkNode
  | SerializedParagraphNode
  | SerializedSoftHyphenNode
  | SerializedNonBreakingSpaceNode
  | { type: string; children?: LexicalNode[]; version: number; [key: string]: unknown };

const createInternalDocToHref = (locale: TypedLocale) => ({
  linkNode,
}: { linkNode: SerializedLinkNode }): string => {
  if (!linkNode.fields.doc) {
    return '';
  }

  const pathField = `path${locale}` as 'pathde' | 'pathfr' | 'pathit' | 'pathen';
  const storedPath = linkNode.fields[pathField];

  if (storedPath && typeof storedPath === 'string' && storedPath.trim().length > 0) {
    return storedPath.trim();
  }

  return '';
};

const createHtmlConverters = ({
  wrap,
  locale,
}: { wrap: boolean | undefined; locale?: TypedLocale }): HTMLConvertersFunction<DefaultNodeTypes> => ({
  defaultConverters,
}) => {
  // Only use locale-aware internalDocToHref if locale is provided
  const internalDocToHref = locale
    ? createInternalDocToHref(locale)
    : undefined;

  const baseConverters = {
    ...defaultConverters,
    ...(internalDocToHref
      ? linkHTMLConverter({
        internalDocToHref,
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
}

// avoid unneccessary rebuild of converters by statically defining
// converters without wrap (for rteToHtml - no locale needed)
const convertersWithoutWrap = createHtmlConverters({
  wrap: false,
});

const rteToHtmlBase = ({
  content,
  wrap,
  locale,
}: InterfaceRteToHtmlProps & { locale?: TypedLocale }): string => {
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

  // For wrap: false (rteToHtml), use static converters
  // For wrap: true (rte4ToHtml), create converters dynamically with locale
  const htmlConverters = wrap
    ? createHtmlConverters({
      locale,
      wrap: true,
    })
    : convertersWithoutWrap;

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
  wrap: false,
});

export const rte4ToHtml = (content: InterfaceRte | undefined | null, locale: TypedLocale): string => rteToHtmlBase({
  content,
  locale,
  wrap: true,
});
