'use client';

import {
  DecoratorNode, NodeKey, SerializedLexicalNode,
} from 'lexical';
import React, { JSX } from 'react';

const nodeType = 'unicode-char-shy';

export type SerializedSoftHyphenNode = SerializedLexicalNode & {
  type: typeof nodeType;
  version: 1;
  text: string;
};

// export decorator node
export class SoftHyphenNode extends DecoratorNode<JSX.Element> {
  public constructor(key?: NodeKey) {
    super(key);
  }

  public static getType(): string {
    return nodeType;
  }

  public static clone(node: SoftHyphenNode): SoftHyphenNode {
    return new SoftHyphenNode(node.__key);
  }

  public createDOM(): HTMLElement {
    const span = document.createElement('span');

    span.style.display = 'inline-block';

    return span;
  }

  public updateDOM(): boolean {
    return false;
  }

  public exportJSON(): SerializedSoftHyphenNode {
    return {
      text: '\u00AD',
      type: nodeType,
      version: 1,
    };
  }

  public static importJSON(): SoftHyphenNode {
    return new SoftHyphenNode();
  }

  public decorate(): JSX.Element {
    return (
      <span
        style={{
          backgroundColor: '#8B0000',
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
        title='Soft hyphen'
      >
        (-)
      </span>
    );
  }
}

// export converter

export const softHyphenJSXConverter = {
  [nodeType]: (): string => '­',
};
