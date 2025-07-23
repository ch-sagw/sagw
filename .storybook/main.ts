import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs'],
  features: {
    experimentalRSC: true,
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  // eslint-disable-next-line require-await
  webpackFinal: async (webpackConfig) => {
    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      '@styles': path.resolve(__dirname, '../src/styles'),
    };

    return webpackConfig;
  },
};

export default config;
