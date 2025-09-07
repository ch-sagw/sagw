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
import styles from '@/components/base/Rte/Rte.module.scss';
import {
  InterfaceRte1, InterfaceRte2,
} from '@/payload-types';
import { softHyphenJSXConverter } from '@/components/admin/rte/features/SoftHyphen/SoftHyphenNode';

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
  ...softHyphenJSXConverter,
});

export type InterfaceRtePropTypes = {
  text: InterfaceRte1['content'] | InterfaceRte2['content'];
};

export const Rte = ({
  text,
}: InterfaceRtePropTypes): React.JSX.Element => (
  <RichText
    className={styles.rte}
    converters={jsxConverters}
    data={text}
  />
);
