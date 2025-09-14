import type { Preview } from '@storybook/nextjs-vite';
import '@/styles/_global.scss';

const preview: Preview = {
  initialGlobals: {
    backgrounds: {
      value: 'light',
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
