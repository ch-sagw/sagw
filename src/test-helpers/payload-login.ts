import { test } from '@playwright/test';

export const beforeEachPayloadLogin = (): void => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/');
    // await page.waitForResponse('http://localhost:3000/api/users/me');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    const loginButton = await page.getByRole('button', {
      name: 'Anmelden',
    });

    await loginButton.click();
    await page.waitForLoadState('networkidle');
  });
};
