import type { SerializedLexicalNode } from 'lexical';

export const NON_BREAKING_SPACE_NODE_TYPE = 'unicode-char-nbsp' as const;

export type SerializedNonBreakingSpaceNode = SerializedLexicalNode & {
  type: typeof NON_BREAKING_SPACE_NODE_TYPE;
  version: 1;
  text: string;
};

export const nonBreakingSpaceJSXConverter = {
  [NON_BREAKING_SPACE_NODE_TYPE]: (): string => '&nbsp;',
};

