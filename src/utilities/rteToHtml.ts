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
import { convertLexicalNodesToHTML } from 'node_modules/@payloadcms/richtext-lexical/dist/features/converters/lexicalToHtml/sync';

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
      const inner = convertLexicalNodesToHTML({
        converters,
        nodes: node.children,
        parent: node,
      });

      return inner.join('');
    };
  }

  return baseConverters;
};

interface InterfaceRteToHtmlProps {
  content: InterfaceRte | undefined | null;
  wrap?: boolean;
}

const rteToHtmlBase = ({
  content,
  wrap,
}: InterfaceRteToHtmlProps): string => {
  if (!content) {
    return '';
  }

  const htmlConverters = createHtmlConverters({
    wrap,
  });

  const transformedData = convertLexicalToHTML({
    converters: htmlConverters,
    data: content,
    disableContainer: true,
  });

  return transformedData;
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
