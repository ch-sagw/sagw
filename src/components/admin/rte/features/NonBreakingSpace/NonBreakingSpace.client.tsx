'use client';

import {
  createClientFeature, toolbarFeatureButtonsGroupWithItems,
} from '@payloadcms/richtext-lexical/client';
import {
  $getSelection, $isRangeSelection, LexicalEditor,
} from 'lexical';
import { NonBreakingSpaceNode } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpaceNode';
import { JSX } from 'react';

const insertNonBreakingSpace = (editor: LexicalEditor): void => {
  editor.update(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = new NonBreakingSpaceNode();

      selection.insertNodes([node]);
    }
  });
};

export default createClientFeature({
  nodes: [NonBreakingSpaceNode],
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
