
// TODO: remove test from sagw and add it to non-sagw tenant

import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('Theme selector', () => {
  beforeEachPayloadLogin();

  test('Shows theme options', async ({
    page,
  }) => {
    const dashboard = await page.locator('.dashboard');
    const themeButton = await dashboard.getByText('Theme');

    await themeButton.click({
      force: true,
    });
    await page.waitForLoadState('networkidle');

    const selectedOption = await page.getByText('sagw');

    await selectedOption.click();

    const option2 = await page.getByText('emerald');

    await expect(option2)
      .toBeVisible();

  });

  // Flaky: payload seems to do several renders on the select. Sometimes,
  // it does it's final render after we selected the theme, thus resulting
  // in resetting the theme selection. As a result we end up with the wrong
  // selection/image and the test is failing:
  // TODO: find stable solution.

  /*
  test('Correctly renders preview image', async ({
    page,
  }) => {
    const dashboard = await page.locator('.dashboard');
    const themeButton = await dashboard.getByText('Theme');

    await themeButton.click({
      force: true,
    });
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');

    const selectedOption = await page.getByLabel('Color Theme');

    await selectedOption.click({
      force: true,
    });

    const option2 = await page.getByRole('option', {
      name: 'Sunset',
    })
      .locator('span');

    await option2.click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('load');

    const image = await page.getByTestId('image');

    await expect(image)
      .toBeVisible();

    await expect(image)
      .toHaveScreenshot();

  });
*/
});

