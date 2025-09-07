import { CollectionBeforeValidateHook } from 'payload';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';

export const hookAdminTitle: CollectionBeforeValidateHook = ({
  data,
}) => {
  const lexical: SerializedEditorState = data?.hero?.title.content;

  if (lexical && data) {
    data[fieldAdminTitleFieldName] = convertLexicalToPlaintext({
      data: lexical,
    });
  }

  return data;
};
