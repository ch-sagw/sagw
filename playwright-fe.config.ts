import {
  defineConfig, devices,
  ReporterDescription,
} from '@playwright/test';
import { vrtConfig } from '@/automated-testing/config';

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

const reporterJson: ReporterDescription = [
  'json',
  {
    outputFile: 'test-results/results.json',
  },
];

const reporterList: ReporterDescription = ['list'];
const reporterBlob: ReporterDescription = ['blob'];

const reporterHtml: ReporterDescription = [
  'html',
  {
    open: 'never',
    outputFolder: 'test-results/html',
  },
];

export const defaultReporters: ReporterDescription[] = [
  reporterJson,
  reporterList,
  reporterHtml,
];

export const ciReporters: ReporterDescription[] = [
  reporterList,
  reporterBlob,
];

export default defineConfig({
  expect: {
    toHaveScreenshot: {

      /* eslint-disable @typescript-eslint/naming-convention*/
      // @ts-expect-error: name error
      _comparator: 'ssim-cie94',
      maxDiffPixelRatio: 0,
      maxDiffPixels: 0,
      pathTemplate: `src/{testFileDir}/${vrtConfig.snapshotFolder}/{testName}/{projectName}{ext}`,
      threshold: 0,
    },
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  outputDir: 'test-results/main',
  projects,
  reporter: process.env.CI
    ? ciReporters
    : defaultReporters,
  retries: 0,
  testDir: './src/',
  testMatch: '**/*.fe.spec.ts?(x)',
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
