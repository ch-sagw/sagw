interface InterfaceRteNode {
  [k: string]: unknown;
  root: {
    type: string;
    children: {
      [k: string]: unknown;
      type: string;
      version: number;
    }[];
    direction: 'ltr' | 'rtl' | null;
    format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify';
    indent: number;
    version: number;
  };
}

export const simpleRteConfig = (text: string): InterfaceRteNode => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});
