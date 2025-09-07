'use client';

import React from 'react';
import type {
  DefaultNodeTypes,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical';
import {
  type JSXConvertersFunction,
  LinkJSXConverter as linkJSXConverter,
  RichText,
} from '@payloadcms/richtext-lexical/react';
import { SerializedEditorState } from 'node_modules/lexical/LexicalEditorState';
import { SerializedLexicalNode } from 'node_modules/lexical/LexicalNode';
import styles from '@/components/blocks/Rte/Rte.module.scss';

const internalDocToHref = ({
  linkNode,
}: { linkNode: SerializedLinkNode }): string => {
  if (!linkNode.fields.doc) {
    return '';
  }

  const {
    relationTo, value,
  } = linkNode.fields.doc;

  return `/${relationTo}/${value}`;
};

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...linkJSXConverter({
    internalDocToHref,
  }),
});

export type InterfaceRtePropTypes = {
  text: SerializedEditorState<SerializedLexicalNode>;
};

export const Rte = ({
  text,
}: InterfaceRtePropTypes): React.JSX.Element => (
  <RichText className={styles.rte} converters={jsxConverters} data={text} />
);
