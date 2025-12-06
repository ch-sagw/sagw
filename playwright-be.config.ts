import {
  defineConfig, devices,
} from '@playwright/test';
import dotenv from 'dotenv';
import {
  ciReporters, defaultReporters,
} from 'playwright-fe.config';

dotenv.config({
  override: true,
  path: './.env/.env.base',
  quiet: true,
});

dotenv.config({
  override: true,
  path: '.env/.env.playwright',
  quiet: true,
});

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0,
      maxDiffPixels: 0,
      threshold: 0,
    },
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  outputDir: 'test-results/main',
  projects: [
    {
      name: 'chromium-1280',
      use: devices['Desktop Chrome HiDPI'],
    },
  ],
  reporter: process.env.CI
    ? ciReporters
    : defaultReporters,
  retries: 0,
  testDir: './src/',
  testMatch: '**/*.be.spec.ts?(x)',
  timeout: 120_000,
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'next dev -H 0.0.0.0 -p 3000',
    env: {

      // issue: in some tests, we import payload config promise. on each,
      // import, promise gets resolved thus the payload init methods gets
      // called, and that's where we seed data. therefore we set this env.
      // this gets removed from env during tests. so we can use it to seed
      // only once.
      DOSEED: 'true',
    },
    reuseExistingServer: !process.env.CI,
    stderr: 'pipe',
    stdout: 'pipe',
    timeout: 2 * 60 * 1000,
    url: 'http://localhost:3000/admin',
  },

  // We can not run BE tests in parallel. We might get into race conditions
  // where one test is deleting data which another test tries to access or edit.
  workers: 1,
});
