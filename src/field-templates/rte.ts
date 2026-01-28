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
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';
import { SoftHyphenFeature } from '@/components/admin/rte/features/SoftHyphen/SoftHyphen.server';
import { NonBreakingSpaceFeature } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpace.server';
import {
  Condition,
  FieldBase,
  FieldHook,
  RichTextField,
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
    ItalicFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    SoftHyphenFeature(),
    NonBreakingSpaceFeature(),
  ],
});

const rte3Editor = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    BoldFeature(),
    ItalicFeature(),
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
    SoftHyphenFeature(),
    NonBreakingSpaceFeature(),
  ],
});

const rte4Editor = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    BoldFeature(),
    ItalicFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    ParagraphFeature(),
    HeadingFeature({
      enabledHeadingSizes: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
      ],
    }),
    UnorderedListFeature(),
    OrderedListFeature(),
    LinkFeature({
      enabledCollections: linkableSlugs.map((slug) => slug.slug),
      maxDepth: 1,
    }),
    SoftHyphenFeature(),
    NonBreakingSpaceFeature(),
  ],
});

/* eslint-enable new-cap */

interface InterfaceRteInputType {
  name: string;
  label?: string;
  notRequired?: boolean;
  disableLocalization?: boolean;
  adminDescription?: string;
  adminCondition?: Condition<any, any> | undefined;
  access?: FieldBase['access'];
}

type InterfaceRteInputTypeInternal = {
  editor: LexicalRichTextAdapterProvider;
} & InterfaceRteInputType;

const rte = ({
  name, notRequired, editor, disableLocalization, adminDescription, adminCondition, access, label,
}: InterfaceRteInputTypeInternal): RichTextField => {

  const fieldObject: RichTextField = {
    access: access
      ? access
      : undefined,
    admin: {
      condition: adminCondition,
      description: adminDescription,
    },
    editor,
    hooks: {
      beforeValidate: [
        ({
          value,
        }): FieldHook => sanitizeRichTextValue(value),
      ],
    },
    localized: !disableLocalization,
    name,
    required: !notRequired,
    type: 'richText',
  };

  if (label) {
    fieldObject.label = label;
  }

  return fieldObject;
};

export const rte1 = ({
  name, notRequired, disableLocalization, adminDescription, adminCondition, access, label,
}: InterfaceRteInputType): RichTextField => rte({
  access,
  adminCondition,
  adminDescription,
  disableLocalization,
  editor: rte1Editor,
  label,
  name,
  notRequired,
});

export const rte2 = ({
  name, notRequired, disableLocalization, adminDescription, adminCondition, access, label,
}: InterfaceRteInputType): RichTextField => rte({
  access,
  adminCondition,
  adminDescription,
  disableLocalization,
  editor: rte2Editor,
  label,
  name,
  notRequired,
});

export const rte3 = ({
  name, notRequired, access, label,
}: InterfaceRteInputType): RichTextField => rte({
  access,
  editor: rte3Editor,
  label,
  name,
  notRequired,
});

export const rte4 = ({
  name, notRequired, access, label,
}: InterfaceRteInputType): RichTextField => rte({
  access,
  editor: rte4Editor,
  label,
  name,
  notRequired,
});
