import type { Preview } from '@storybook/nextjs';
import '@/styles/_global.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(?<temp1>background|color)$/iu,
        date: /Date$/iu,
      },
    },
  },
};

export default preview;
