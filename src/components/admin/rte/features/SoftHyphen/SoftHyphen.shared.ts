import type { SerializedLexicalNode } from 'lexical';

export const SOFT_HYPHEN_NODE_TYPE = 'unicode-char-shy' as const;

export type SerializedSoftHyphenNode = SerializedLexicalNode & {
  type: typeof SOFT_HYPHEN_NODE_TYPE;
  version: 1;
  text: string;
};

export const softHyphenJSXConverter = {
  [SOFT_HYPHEN_NODE_TYPE]: (): string => '\u00AD',
};

