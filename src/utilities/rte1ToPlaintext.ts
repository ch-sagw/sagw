import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';

export const rte1ToPlaintext = (rte1Content: SerializedEditorState): string => {

  const transformedData = convertLexicalToPlaintext({
    data: rte1Content,
  });

  const removedSoftHyphen = transformedData.replaceAll('\u00AD', '');

  return removedSoftHyphen;

};
