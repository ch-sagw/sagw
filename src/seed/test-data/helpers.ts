import { File } from 'payload';

export const fetchFileByURL = async (url: string): Promise<File> => {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`);
  }

  const data = await res.arrayBuffer();

  return {
    data: Buffer.from(data),
    mimetype: `image/${url.split('.')
      .pop()}`,
    name: url.split('/')
      .pop() || `file-${Date.now()}`,
    size: data.byteLength,
  };
};

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
