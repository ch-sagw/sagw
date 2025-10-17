import { test } from '@playwright/test';

export const beforeEachPayloadLogin = (): void => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    await page.waitForFunction('document.cookie.includes(\'payload-tenant\')');
  });
};
