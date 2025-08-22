'use client';

import {
  createClientFeature, toolbarFeatureButtonsGroupWithItems,
} from '@payloadcms/richtext-lexical/client';
import {
  $getSelection, $isRangeSelection, LexicalEditor,
} from 'lexical';
import { SoftHyphenNode } from './SoftHyphenNode';
import { JSX } from 'react';

// Inserts a SoftHyphenNode inline
const insertSoftHyphen = (editor: LexicalEditor): void => {
  editor.update(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = new SoftHyphenNode();

      selection.insertNodes([node]);
    }
  });
};

export default createClientFeature({
  nodes: [SoftHyphenNode],
  toolbarFixed: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          ChildComponent: (): JSX.Element => <p>-</p>,
          key: 'softHyphenButton',
          onSelect: ({
            editor,
          }): void => insertSoftHyphen(editor),
          order: 100,
        },
      ]),
    ],
  },
});
