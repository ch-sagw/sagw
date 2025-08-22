import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  JSX,
  useEffect, useState,
} from 'react';
import {
  $getRoot, TextNode,
} from 'lexical';

export const SoftHyphenPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [, setTick] = useState(0);

  useEffect(() => {
    // NodeTransform already gives a safe node reference
    const unregister = editor.registerNodeTransform(TextNode, (node) => {
      const text = node.getTextContent();

      if (text.includes('\u00AD')) {
        setTick((t) => t + 1);
      }
    });

    return () => unregister();
  }, [editor]);

  // Render visual markers
  const markers: JSX.Element[] = [];

  editor.getEditorState()
    .read(() => {
      const root = $getRoot();

      root.getAllTextNodes()
        .forEach((node) => {
          const text = node.getTextContent();

          Array.from(text)
            .forEach((char, idx) => {
              if (char === '\u00AD') {
                markers.push(<span
                  key={`${node.getKey()}-${idx}`}
                  style={{
                    backgroundColor: '#f0ad4e',
                    borderRadius: '2px',
                    display: 'inline-block',
                    height: '1em',
                    marginRight: '1px',
                    verticalAlign: 'middle',
                    width: '0.5em',
                  }}
                  title='Soft hyphen'
                >
                  &shy;
                </span>);
              }
            });
        });
    });

  return <>{markers}</>;
};
