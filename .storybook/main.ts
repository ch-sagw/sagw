import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  addons: [],
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
};

export default config;
