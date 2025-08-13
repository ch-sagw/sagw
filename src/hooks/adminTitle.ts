import { CollectionBeforeValidateHook } from 'payload';

const lexicalToPlainText = (lexical: any): string => {
  const root = lexical?.root;

  if (!root || !Array.isArray(root.children)) {
    return '';
  }

  const parts: string[] = [];

  const walk = (node: any): void => {
    if (!node) {
      return;
    }

    // Text node
    if (node.type === 'text' && typeof node.text === 'string') {
      parts.push(node.text);

      return;
    }

    // Line break node
    if (node.type === 'linebreak') {
      parts.push('\n');

      return;
    }

    // Container nodes
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child);
      }
    }
  };

  for (const child of root.children) {
    walk(child);
  }

  return parts.join('')
    .replace(/\s+/gu, ' ')
    .trim();
};

export const hookAdminTitle: CollectionBeforeValidateHook = ({
  data,
}) => {
  const lexical = data?.hero?.title;

  if (lexical) {
    const plain = lexicalToPlainText(lexical);

    data.adminTitle = plain.length > 140
      ? `${plain.slice(0, 137)}…`
      : plain;
  }

  return data;
};
