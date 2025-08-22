import {
  defineConfig, devices,
} from '@playwright/test';

import dotenv from 'dotenv';

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
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    {
      name: 'chromium-1280',
      use: devices['Desktop Chrome HiDPI'],
    },
  ],
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
  testMatch: '**/*.be.spec.ts?(x)',
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'next dev -H 0.0.0.0 -p 3000',
    reuseExistingServer: !process.env.CI,
    stderr: 'pipe',
    stdout: 'pipe',
    url: 'http://localhost:3000',
  },

  workers: process.env.CI
    ? 2
    : 5,
});
