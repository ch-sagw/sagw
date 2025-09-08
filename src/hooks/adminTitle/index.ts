import { CollectionBeforeValidateHook } from 'payload';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';

export const hookAdminTitle: CollectionBeforeValidateHook = ({
  data,
}) => {
  const lexical: SerializedEditorState = data?.hero?.title.content;

  if (lexical && data) {
    const transformedData = convertLexicalToPlaintext({
      data: lexical,
    });

    data[fieldAdminTitleFieldName] = transformedData.replaceAll('\u00AD', '');
  }

  return data;
};
