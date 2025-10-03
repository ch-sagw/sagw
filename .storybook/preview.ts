import type { Preview } from '@storybook/nextjs-vite';
import '@/styles/_global.scss';
import './preview.css';

const preview: Preview = {
  initialGlobals: {
    backgrounds: {
      value: 'white',
    },
  },
  parameters: {
    backgrounds: {
      options: {
        dark: {
          name: 'SAGW Dark',
          value: '#1E3241',
        },
        light: {
          name: 'SAGW Light',
          value: '#C8E1F0',
        },
        white: {
          name: 'SAGW White',
          value: '#FFF',
        },
      },
    },
    controls: {
      matchers: {
        // color: /(?<temp1>background|color)$/iu,
        date: /Date$/iu,
      },
    },
  },
};

export default preview;
