// http://localhost:3000/admin/collections/instituteDetail/create

import {
  expect,
  Locator,
  test,
} from '@playwright/test';

test.describe.serial('Internal Link Choosers', () => {
  let linkTargetInput: Locator;

  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/instituteDetail/create');
    await page.waitForLoadState('load');

    linkTargetInput = await page.getByLabel('Link Target');
  });

  test('shows available links correctly', async ({
    page,
  }) => {
    await linkTargetInput.click();

    const homePageLink = await page.getByText('Home Page');
    const publicationLink = await page.getByText('Publication 1 Title');
    const newsLink = await page.getByText('News 1 Title');

    await expect(homePageLink)
      .toBeVisible();

    await expect(publicationLink)
      .toBeVisible();

    await expect(newsLink)
      .toBeVisible();
  });
});
