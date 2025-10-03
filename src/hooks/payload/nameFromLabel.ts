import { SerializedEditorState } from 'node_modules/lexical/LexicalEditorState';
import validator from 'validator';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

export const nameFromLabel = (siblingData: Partial<any>): string => {
  if (!siblingData?.label) {
    return '';
  }

  let {
    label,
  } = siblingData;

  if (siblingData?.blockType === 'checkboxBlock') {
    const lexical: SerializedEditorState = siblingData?.label.content;

    label = rte1ToPlaintext(lexical);
  }

  // Lowercase, trim, replace spaces with dashes
  const slug = label.toLowerCase()
    .trim()
    .replace(/\s+/gu, '-');

  // Whitelist only letters, numbers, dashes, underscores
  const whitelistedSlug = validator.whitelist(slug, 'a-z0-9-_');

  return whitelistedSlug;
};
