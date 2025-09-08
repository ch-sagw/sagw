/* eslint-disable new-cap */
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
import {
  FieldHook, RichTextField,
} from 'payload';
import { JSDOM } from 'jsdom';
import domPurify from 'dompurify';
import validator from 'validator';
import { linkableSlugs } from '@/collections/Pages/pages';

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

const rte1Editor = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    SoftHyphenFeature(),
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
  ],
});

interface InterfaceRteInputType {
  name: string;
  required: boolean;
}

export const rte1 = ({
  name, required,
}: InterfaceRteInputType): RichTextField => ({
  editor: rte1Editor,
  hooks: {
    beforeValidate: [
      ({
        value,
      }): FieldHook => sanitizeRichTextValue(value),
    ],
  },
  localized: true,
  name,
  required,
  type: 'richText',
});

export const rte2 = ({
  name, required,
}: InterfaceRteInputType): RichTextField => ({
  editor: rte2Editor,
  hooks: {
    beforeValidate: [
      ({
        value,
      }): FieldHook => sanitizeRichTextValue(value),
    ],
  },
  localized: true,
  name,
  required,
  type: 'richText',
});

/* eslint-enable new-cap */
