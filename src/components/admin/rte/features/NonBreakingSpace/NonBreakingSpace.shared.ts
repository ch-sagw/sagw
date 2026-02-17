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
// dashes (en-dash, em-dash)
export const sanitizeHtmlHelper = (htmlText: string): string => {
  let sanitizedHtmlText = validator.whitelist(htmlText, '\\x09\\x0A\\x0D\\x20-\\x7E\\u00A0-\\u00FF\\u2013-\\u2014\\u2019');

  sanitizedHtmlText = sanitizeHtml(sanitizedHtmlText, {
    allowedAttributes: {},
    allowedTags: [],
  });

  return sanitizedHtmlText;
};
