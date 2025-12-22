import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs'],
  features: {
    experimentalRSC: true,
  },
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: (viteConfig) => {
    // Exclude Payload and file-type from dependency optimization
    // Payload imports fileTypeFromFile which doesn't
    // exist in the installed file-type version
    viteConfig.optimizeDeps = viteConfig.optimizeDeps || {};
    viteConfig.optimizeDeps.exclude = [
      ...(viteConfig.optimizeDeps.exclude || []),
      'payload',
      'file-type',
    ];

    return viteConfig;
  },
};

export default config;
