import { CollectionBeforeValidateHook } from 'payload';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

export const hookAdminTitle: CollectionBeforeValidateHook = ({
  data,
}) => {
  const lexical: SerializedEditorState = data?.hero?.title.content;
  const dataString = rte1ToPlaintext(lexical);

  if (data) {
    data[fieldAdminTitleFieldName] = dataString;
  }

  return data;
};
