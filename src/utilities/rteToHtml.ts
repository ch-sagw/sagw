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
import type { TypedLocale } from 'payload';

import { externalLink } from '@/icons/ui/external-link';

// Union type for all possible lexical nodes
type LexicalNode =
  | SerializedTextNode
  | SerializedLinkNode
  | SerializedParagraphNode
  | SerializedSoftHyphenNode
  | SerializedNonBreakingSpaceNode
  | { type: string; children?: LexicalNode[]; version: number; [key: string]: unknown };

const createHtmlConverters = ({
  locale,
  wrap,
}: { locale?: TypedLocale; wrap: boolean | undefined }): HTMLConvertersFunction<DefaultNodeTypes> => ({
  defaultConverters,
}) => {
  // Create internalDocToHref with locale closure
  const internalDocToHref = ({
    linkNode,
  }: { linkNode: SerializedLinkNode & { fields?: { internalUrl?: { de?: string | null; fr?: string | null; it?: string | null; en?: string | null } } } }): string => {
    // Check if we have stored URLs in internalUrl field
    // (populated by beforeValidate hook)
    // This is a custom field we add, not part of SerializedLinkNode's
    // standard fields
    const internalUrl = (linkNode.fields as any)?.internalUrl;

    if (internalUrl && typeof internalUrl === 'object' && locale) {
      // Use the locale-specific URL
      const url = internalUrl[locale];

      if (url) {
        return url;
      }
    }

    // Fallback: generate from fields.doc (Payload's standard way)
    if (!linkNode.fields?.doc) {
      return '';
    }

    const {
      relationTo, value,
    } = linkNode.fields.doc;

    return `/${relationTo}/${value}`;
  };

  const baseConverters = {
    ...defaultConverters,
    ...linkHTMLConverter({
      internalDocToHref,
    }),
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
  locale?: TypedLocale;
  wrap?: boolean;
}

const rteToHtmlBase = ({
  content,
  locale,
  wrap,
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

  // Create converters with locale (converters are now locale-aware)
  const htmlConverters = createHtmlConverters({
    locale,
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
  wrap: false,
});

export const rte3ToHtml = (content: InterfaceRte | undefined | null, locale: TypedLocale): string => rteToHtmlBase({
  content,
  locale,
  wrap: false,
});

export const rte4ToHtml = (content: InterfaceRte | undefined | null, locale: TypedLocale): string => rteToHtmlBase({
  content,
  locale,
  wrap: true,
});
