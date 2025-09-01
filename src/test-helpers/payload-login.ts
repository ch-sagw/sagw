import { test } from '@playwright/test';

export const beforeEachPayloadLogin = (): void => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    const loginButton = await page.getByRole('button', {
      name: 'Anmelden',
    });

    // glitch in payload login.
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    await loginButton.click();
    await page.waitForLoadState('networkidle');

    await page.waitForURL('http://localhost:3000/admin');
  });
};
