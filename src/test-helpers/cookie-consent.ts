import { test } from '@playwright/test';

export const beforeEachAcceptCookies = (): void => {
  test.beforeEach(async ({
    context,
  }) => {
    await context.addCookies([
      {
        domain: 'localhost',
        name: 'cookie_consent',
        path: '/',
        value: '{"analytics":true,"consentGiven":true,"essential":true,"external":true,"timestamp":1762095991926}',
      },
    ]);
  });
};
