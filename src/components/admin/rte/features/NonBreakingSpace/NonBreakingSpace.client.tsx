'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  createClientFeature, toolbarFeatureButtonsGroupWithItems,
} from '@payloadcms/richtext-lexical/client';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  LexicalEditor,
  PASTE_COMMAND,
} from 'lexical';
import { NonBreakingSpaceNode } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpaceNode';
import {
  JSX, useEffect,
} from 'react';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';

const NON_BREAKING_SPACE = '\u00A0';

const insertNonBreakingSpace = (editor: LexicalEditor): void => {
  editor.update(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = new NonBreakingSpaceNode();

      selection.insertNodes([node]);
    }
  });
};

const insertTextPreservingNbsp = (
  editor: LexicalEditor,
  text: string,
): void => {
  editor.update(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    const parts = text.split(/(?<nonBreakingSpace>\u00A0)/u)
      .filter((part) => part.length > 0);
    const nodes = parts.map((part) => (part === NON_BREAKING_SPACE
      ? new NonBreakingSpaceNode()
      : $createTextNode(part)));

    selection.insertNodes(nodes);
  });
};

const getClipboardTextWithNbsp = (event: ClipboardEvent): string | null => {
  const {
    clipboardData,
  } = event;

  if (!clipboardData) {
    return null;
  }

  const plainText = clipboardData.getData('text/plain');

  if (plainText.includes(NON_BREAKING_SPACE)) {
    return plainText;
  }

  const htmlText = clipboardData.getData('text/html');

  if (!htmlText) {
    return null;
  }

  if (!(/&nbsp;|\u00A0/gu).test(htmlText)) {
    return null;
  }

  let sanitizedHtmlText = validator.whitelist(htmlText, '\\x09\\x0A\\x0D\\x20-\\x7E\\u00A0-\\u00FF\\u2013-\\u2014\\u2019');

  sanitizedHtmlText = sanitizeHtml(sanitizedHtmlText, {
    allowedAttributes: {},
    allowedTags: [],
  });

  const parsedHtmlText = new DOMParser()
    .parseFromString(sanitizedHtmlText, 'text/html')
    .body
    .textContent ?? '';

  return parsedHtmlText.includes(NON_BREAKING_SPACE)
    ? parsedHtmlText
    : null;
};

const NonBreakingSpacePastePlugin = (): null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => editor.registerCommand<ClipboardEvent>(
    PASTE_COMMAND,
    (event) => {
      if (!event) {
        return false;
      }

      const textWithNbsp = getClipboardTextWithNbsp(event);

      if (!textWithNbsp) {
        return false;
      }

      event.preventDefault();
      insertTextPreservingNbsp(editor, textWithNbsp);

      return true;
    },
    COMMAND_PRIORITY_HIGH,
  ), [editor]);

  return null;
};

export default createClientFeature({
  nodes: [NonBreakingSpaceNode],
  plugins: [
    {
      Component: NonBreakingSpacePastePlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          ChildComponent: (): JSX.Element => <p>[ ]</p>,
          key: 'nonBreakingSpaceButton',
          onSelect: ({
            editor,
          }): void => insertNonBreakingSpace(editor),
          order: 100,
        },
      ]),
    ],
  },
});
