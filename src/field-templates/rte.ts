import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';
import { SoftHyphenFeature } from '@/components/admin/rte/features/SoftHyphen/SoftHyphen.server';
import { NonBreakingSpaceFeature } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpace.server';
import {
  FieldHook, GroupField,
} from 'payload';
import { JSDOM } from 'jsdom';
import domPurify from 'dompurify';
import validator from 'validator';
import { linkableSlugs } from '@/collections/Pages/pages';
import { LexicalRichTextAdapterProvider } from 'node_modules/@payloadcms/richtext-lexical/dist/types';

const {
  window,
} = new JSDOM('');
const purify = domPurify(window);

const sanitizeNode = (node: any): void => {
  if (node.text && typeof node.text === 'string') {

    // clean up.
    // allow: letters, numbers, punctuation, space, tabs, newlines
    node.text = validator.whitelist(node.text, '\\x09\\x0A\\x0D\\x20-\\x7E\\u00A0-\\u00FF\\u2019');

    // sanitize
    node.text = purify.sanitize(node.text, {
      USE_PROFILES: {
        html: false,
      },
    });
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(sanitizeNode);
  }
};

const sanitizeRichTextValue: FieldHook = (value: unknown): string | unknown => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  const cloned = JSON.parse(JSON.stringify(value));

  if (cloned.root) {
    sanitizeNode(cloned.root);
  }

  return cloned;

};

/* eslint-disable new-cap */
const rte1Editor = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    SoftHyphenFeature(),
    NonBreakingSpaceFeature(),
  ],
});

const rte2Editor = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    ParagraphFeature(),
    HeadingFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    LinkFeature({
      enabledCollections: linkableSlugs.map((slug) => slug.slug),
      maxDepth: 1,
    }),
    NonBreakingSpaceFeature(),
  ],
});

const rte3Editor = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    ParagraphFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    LinkFeature({
      enabledCollections: linkableSlugs.map((slug) => slug.slug),
      maxDepth: 1,
    }),
    NonBreakingSpaceFeature(),
  ],
});
/* eslint-enable new-cap */

interface InterfaceRteInputType {
  name: string;
  required: boolean;
}

interface InterfaceRteInputTypeInternal {
  name: string;
  required: boolean;
  interfaceName: string;
  editor: LexicalRichTextAdapterProvider;
}

const rte = ({
  name, required, interfaceName, editor,
}: InterfaceRteInputTypeInternal): GroupField => ({

  // we want to have Rte in a group, so that we can automatically generate an
  // interface for the rte content.

  fields: [
    {
      editor,
      hooks: {
        beforeValidate: [
          ({
            value,
          }): FieldHook => sanitizeRichTextValue(value),
        ],
      },
      localized: true,
      name: 'content',
      required,
      type: 'richText',
    },
  ],
  interfaceName,
  name,
  type: 'group',
});

export const rte1 = ({
  name, required,
}: InterfaceRteInputType): GroupField => rte({
  editor: rte1Editor,
  interfaceName: 'InterfaceRte1',
  name,
  required,
});

export const rte2 = ({
  name, required,
}: InterfaceRteInputType): GroupField => rte({
  editor: rte2Editor,
  interfaceName: 'InterfaceRte2',
  name,
  required,
});

export const rte3 = ({
  name, required,
}: InterfaceRteInputType): GroupField => rte({
  editor: rte3Editor,
  interfaceName: 'InterfaceRte3',
  name,
  required,
});
