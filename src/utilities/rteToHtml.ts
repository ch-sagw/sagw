import { InterfaceRte } from '@/components/base/types/rte';
import {
  convertLexicalToHTML, HTMLConvertersFunction,
  LinkHTMLConverter as linkHTMLConverter,
} from '@payloadcms/richtext-lexical/html';
import { softHyphenJSXConverter } from '@/components/admin/rte/features/SoftHyphen/SoftHyphenNode';
import { nonBreakingSpaceJSXConverter } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpaceNode';
import {
  DefaultNodeTypes, SerializedLinkNode,
} from '@payloadcms/richtext-lexical';
import { SerializedParagraphNode } from '@payloadcms/richtext-lexical/lexical';
import { externalLink } from '@/icons/ui/external-link';

const internalDocToHref = ({
  linkNode,
}: { linkNode: SerializedLinkNode }): string => {
  if (!linkNode.fields.doc) {
    return '';
  }

  const {
    relationTo, value,
  } = linkNode.fields.doc;

  return `/${relationTo}/${value}`;
};

const createHtmlConverters = ({
  wrap,
}: { wrap: boolean | undefined }): HTMLConvertersFunction<DefaultNodeTypes> => ({
  defaultConverters,
}) => {
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

// Add icons to existing links based on their target attribute
const addIconsToLinks = (html: string): string => {
  const linkRegex = /<a\s+(?<capGroup2>[^>]*?)>(?<capGroup1>.*?)<\/a>/giu;

  return html.replace(linkRegex, (match, attributes, linkText) => {
    // Extract target attribute
    const targetMatch = attributes.match(/target\s*=\s*["'](?<capGroup1>[^"']*)["']/iu);
    const target = targetMatch
      ? targetMatch[1]
      : '_self';

    let iconContent = '';

    if (target === '_blank') {
      iconContent = externalLink;
    }

    return `<a ${attributes}>${linkText}${iconContent}</a>`;
  });
};

interface InterfaceRteToHtmlProps {
  content: InterfaceRte | undefined | null;
  wrap?: boolean;
}

// avoid unneccessary rebuild of converters by statically defining
// the 2 sets of converters

const convertersWithWrap = createHtmlConverters({
  wrap: true,
});
const convertersWithoutWrap = createHtmlConverters({
  wrap: false,
});

const rteToHtmlBase = ({
  content,
  wrap,
}: InterfaceRteToHtmlProps): string => {
  if (!content) {
    return '';
  }

  const htmlConverters = wrap
    ? convertersWithWrap
    : convertersWithoutWrap;

  const transformedData = convertLexicalToHTML({
    converters: htmlConverters,
    data: content,
    disableContainer: true,
  });

  const dataWithLinks = addIconsToLinks(transformedData);

  return dataWithLinks;
};

/*
Requirement: Rte3 is the only rte config which allows true paragraphing.

Problem: e.g. input label text is rte1. Paragraphs don't make sense there.
But still, payload allows to add paragraphs in lexical field. We can't disable
it unless we build a complete custom lexical implementation on ourselves.

Solution:
- For Rte1 and Rte2, we join the paragraph nodes and therefore removing them
completely. This is done by setting `wrap: false`.
- For Rte3, we want paragraphs, therefore we skip the join process. This is
done by setting `wrap: true`.
*/

export const rteToHtml = (content: InterfaceRte | undefined | null): string => rteToHtmlBase({
  content,
  wrap: false,
});

export const rte3ToHtml = (content: InterfaceRte | undefined | null): string => rteToHtmlBase({
  content,
  wrap: true,
});
