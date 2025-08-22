'use client';

import {
  createClientFeature,
  toolbarFeatureButtonsGroupWithItems,
} from '@payloadcms/richtext-lexical/client';
import {
  $getSelection, $isRangeSelection, type LexicalEditor,
} from 'lexical';
import { SoftHyphenPlugin } from '@/components/admin/rte/features/emDash/SoftHyphenPlugin';

import { JSX } from 'react';

const insertEmDash = (editor: LexicalEditor): void => {
  editor.update(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      selection.insertText('\u00AD');
    }
  });
};

export default createClientFeature({
  plugins: [
    {
      Component: SoftHyphenPlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          ChildComponent: (): JSX.Element => <p>-</p>,
          key: 'emDashBtn',
          onSelect: ({
            editor,
          }): void => insertEmDash(editor),
          order: 100,
        },
      ]),
    ],
  },
});
