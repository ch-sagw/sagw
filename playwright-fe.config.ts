import {
  defineConfig,
  ReporterDescription,
} from '@playwright/test';
import { vrtConfig } from '@/automated-testing/config';
import { fePlaywrightProjects } from '@/test-helpers/playwright-projects';

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
    timeout: 10_000,
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
  projects: fePlaywrightProjects,
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
    env: {
      NEXT_PUBLIC_DISABLE_VIEW_TRANSITIONS: 'true',
    },
    reuseExistingServer: !process.env.CI,
    stderr: 'ignore',
    stdout: 'ignore',
    url: 'http://localhost:6006',
  },
  workers: process.env.CI
    ? 2
    : 5,
});
