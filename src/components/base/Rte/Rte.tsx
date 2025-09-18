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
import { cva } from 'cva';
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
  rteConfig: 'rte1' | 'rte2';
  context?: 'notification' | 'heroLead' | 'magazineDetailLead' | 'magazineDetailText'
};

const rteClasses = cva([styles.rte], {
  variants: {
    context: {
      heroLead: [styles.heroLead],
      magazineDetailLead: [styles.magazineDetailLead],
      magazineDetailText: [styles.magazineDetailText],
      notification: [styles.notification],
    },
    rteConfig: {
      rte1: [styles.rte1],
      rte2: [styles.rte2],
    },
  },
});

export const Rte = ({
  context,
  text,
  rteConfig,
}: InterfaceRtePropTypes): React.JSX.Element => (
  <RichText
    className={rteClasses({
      context: context ?? undefined,
      rteConfig: rteConfig ?? undefined,
    })}
    converters={jsxConverters}
    data={text}
  />
);
