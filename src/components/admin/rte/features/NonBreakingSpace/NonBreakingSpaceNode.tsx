'use client';

import {
  DecoratorNode, NodeKey, SerializedLexicalNode,
} from 'lexical';
import React, { JSX } from 'react';

const nodeType = 'unicode-char-nbsp';

export type SerializedNonBreakingSpaceNode = SerializedLexicalNode & {
  type: typeof nodeType;
  version: 1;
  text: string;
};

// export decorator node
export class NonBreakingSpaceNode extends DecoratorNode<JSX.Element> {
  public constructor(key?: NodeKey) {
    super(key);
  }

  public static getType(): string {
    return nodeType;
  }

  public static clone(node: NonBreakingSpaceNode): NonBreakingSpaceNode {
    return new NonBreakingSpaceNode(node.__key);
  }

  public createDOM(): HTMLElement {
    const span = document.createElement('span');

    span.style.display = 'inline-block';

    return span;
  }

  public updateDOM(): boolean {
    return false;
  }

  public exportJSON(): SerializedNonBreakingSpaceNode {
    return {
      text: '\u00A0',
      type: nodeType,
      version: 1,
    };
  }

  public static importJSON(): NonBreakingSpaceNode {
    return new NonBreakingSpaceNode();
  }

  public decorate(): JSX.Element {
    return (
      <span
        style={{
          backgroundColor: '#008b00',
          borderRadius: '2px',
          color: '#fff',
          display: 'inline-block',
          fontSize: '1em',
          fontWeight: 'bold',
          height: '1em',
          lineHeight: '1em',
          margin: '0 2px',
          textAlign: 'center',
        }}
        title='Non-Breaking space'
      >
        [ ]
      </span>
    );
  }
}

// export converter

export const nonBreakingSpaceJSXConverter = {
  [nodeType]: (): string => ' ',
};
