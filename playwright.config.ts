import {
  defineConfig, devices,
} from '@playwright/experimental-ct-react';

const projects = [
  // viewport micro
  {
    name: 'chromium-400',
    use: {
      ...devices['Desktop Chrome'],
      viewport: {
        height: 480,
        width: 400,
      },
    },
  },

  // viewport small
  {
    name: 'chromium-700',
    use: {
      ...devices['Desktop Chrome'],
      viewport: {
        height: 480,
        width: 700,
      },
    },
  },

  // viewport medium
  {
    name: 'chromium-800',
    use: {
      ...devices['Desktop Chrome'],
      viewport: {
        height: 480,
        width: 800,
      },
    },
  },

  // default viewport
  {
    name: 'chromium-1280',
    use: devices['Desktop Chrome HiDPI'],
  },

  // desktop firefox
  {
    name: 'firefox',
    use: devices['Desktop Firefox'],
  },
];

export default defineConfig({
  expect: {
    toHaveScreenshot: {

      /* eslint-disable @typescript-eslint/naming-convention */
      // @ts-expect-error: name error
      _comparator: 'ssim-cie94',

      maxDiffPixelRatio: 0,
      maxDiffPixels: 0,
      scale: 'device',
      threshold: 0,
    },
  },
  fullyParallel: true,
  projects,
  reporter: [
    [
      'html',
      {
        open: 'never',
      },
    ],
    [
      'json',
      {
        outputFile: 'test-results/results.json',
      },
    ],
    ['list'],
  ],
  retries: 0,
  testDir: './src/',
  use: {
    trace: 'on-first-retry',
  },
  workers: process.env.CI
    ? 2
    : 5,
});
