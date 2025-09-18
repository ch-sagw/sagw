import {
  defineConfig, devices,
} from '@playwright/test';
import dotenv from 'dotenv';
import {
  defaultReporters, reporterBlob,
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
  fullyParallel: true,
  projects: [
    {
      name: 'chromium-1280',
      use: devices['Desktop Chrome HiDPI'],
    },
  ],
  reporter: process.env.CI
    ? [
      reporterBlob('be'),
      ...defaultReporters('be'),
    ]
    : defaultReporters('be'),
  retries: 0,
  testDir: './src/',
  testMatch: '**/*.be.spec.ts?(x)',
  timeout: 120_000,
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'next dev -H 0.0.0.0 -p 3000',
    reuseExistingServer: !process.env.CI,
    stderr: 'pipe',
    stdout: 'pipe',
    url: 'http://localhost:3000/admin',
  },

  // We can not run BE tests in parallel. We might get into race conditions
  // where one test is deleting data which another test tries to access or edit.
  workers: 1,
});
