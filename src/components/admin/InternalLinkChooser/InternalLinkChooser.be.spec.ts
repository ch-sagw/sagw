import {
  expect,
  test,
} from '@playwright/test';

test.describe.serial('Internal Link Choosers', () => {
  test('shows available links', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/instituteDetail/create');
    await page.waitForLoadState('load');

    const linkTargetInput = await page.getByLabel('Link Target');

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

  test('shows available links in overlay context', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationDetail/create');
    await page.waitForLoadState('load');

    const addContentBlock = await page.getByText('Content Block hinzufügen');

    await addContentBlock.click();

    const rteField = await page.locator('#field-contentBlocks .ContentEditable__root');

    await rteField.fill('foo');
    await rteField.selectText();

    const linkButton = await page.locator('.toolbar-popup__button-link');

    await linkButton.click();

    const linkTargetInput = await page.getByLabel('Link Target');

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
