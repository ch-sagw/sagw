import type { Preview } from '@storybook/nextjs-vite';
import '@/styles/_global.scss';
import './preview.css';
import defaultMessages from '@/i18n/messages/de.json';
import { NextIntlClientProvider } from 'next-intl';
import { JSX } from 'react';

const preview: Preview = {
  decorators: [
    (Story): JSX.Element => (
      <NextIntlClientProvider
        locale='en'
        messages={defaultMessages}
      // ... potentially other config
      >
        <Story />
      </NextIntlClientProvider>
    ),
  ],
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
