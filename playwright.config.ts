import {
  defineConfig, devices,
} from '@playwright/test';

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

  // desktop safari
  {
    name: 'webkit',
    use: devices['Desktop Safari'],
  },

];

export default defineConfig({
  expect: {
    toHaveScreenshot: {

      // _comparator: 'ssim-cie94',

      maxDiffPixelRatio: 0,
      maxDiffPixels: 0,
      pathTemplate: '{arg}{ext}',
      // scale: 'device',
      threshold: 0,
    },
  },
  forbidOnly: Boolean(process.env.CI),
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
  webServer: {
    command: 'npm run storybook:ci',
    reuseExistingServer: !process.env.CI,
    stderr: 'ignore',
    stdout: 'ignore',
    url: 'http://localhost:6006',
  },
  workers: process.env.CI
    ? 2
    : 5,
});
