'use client';

import type {
  DefaultNodeTypes,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical';
import {
  type JSXConvertersFunction,
  LinkJSXConverter as linkJSXConverter,
} from '@payloadcms/richtext-lexical/react';
import { InterfaceNotification } from '@/payload-types';

export type InterfaceNotificationPropTypes = {} & InterfaceNotification;

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

export const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...linkJSXConverter({
    internalDocToHref,
  }),
});
