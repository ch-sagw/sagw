import type { SerializedLexicalNode } from 'lexical';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';

export const NON_BREAKING_SPACE_NODE_TYPE = 'unicode-char-nbsp' as const;

export type SerializedNonBreakingSpaceNode = SerializedLexicalNode & {
  type: typeof NON_BREAKING_SPACE_NODE_TYPE;
  version: 1;
  text: string;
};

export const nonBreakingSpaceJSXConverter = {
  [NON_BREAKING_SPACE_NODE_TYPE]: (): string => '&nbsp;',
};

// sanitizer
// allow: letters, numbers, punctuation, space, tabs, newlines,
// dashes (en-dash, em-dash), and some others ;) (œ, Œ, ğ, š, …)
// also allows the extended Latin script blocks so IJMES transliteration
// characters for Arabic/Persian/Turkish (ʾ ʿ ḥ ḍ ṣ ṭ ẓ ḳ, …) survive:
// - \u0180-\u024F Latin Extended-B
// - \u02B0-\u02FF Spacing Modifier Letters (ʾ, ʿ)
// - \u1E00-\u1EFF Latin Extended Additional (ḥ, ḍ, ṣ, ṭ, ẓ, ḳ, ẞ, …)
// input is normalized to NFC first, so decomposed characters (base letter
// + combining mark) compose into the allowed precomposed code points
export const sanitizeHtmlHelper = (htmlText: string): string => {
  let sanitizedHtmlText = validator.whitelist(
    htmlText.normalize('NFC'),
    '\\x09\\x0A\\x0D\\x20-\\x7E\\u00A0-\\u00FF\\u0100-\\u017F\\u0180-\\u024F\\u02B0-\\u02FF\\u1E00-\\u1EFF\\u2013-\\u2014\\u2019',
  );

  sanitizedHtmlText = sanitizeHtml(sanitizedHtmlText, {
    allowedAttributes: {},
    allowedTags: [],
  });

  return sanitizedHtmlText;
};
