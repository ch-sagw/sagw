import { InterfaceRte } from '@/components/base/types/rte';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';

export const rte1ToPlaintext = (rte1Content: InterfaceRte | undefined | null): string => {

  if (!rte1Content) {
    return '';
  }

  const transformedData = convertLexicalToPlaintext({
    data: rte1Content,
  });

  const removedSoftHyphen = transformedData.replaceAll('\u00AD', '');

  return removedSoftHyphen;

};
