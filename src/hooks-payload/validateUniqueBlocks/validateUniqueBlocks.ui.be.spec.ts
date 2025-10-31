import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('Unique blocks', () => {
  beforeEachPayloadLogin();

  test('only allows 1 overview block per page in Admin UI', async ({
    page,
  }) => {
    // create an overview page
    await page.goto('http://localhost:3000/admin/collections/overviewPage/create');
    await page.waitForLoadState('networkidle');

    // fill title
    const heroBlock = await page.locator('#field-hero');

    const titleField = await heroBlock.locator('.rich-text-lexical')
      .nth(0)
      .locator('.ContentEditable__root');

    await titleField.fill('title3');

    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    const slugField = await page.locator('#field-slug');

    await expect(slugField)
      .toHaveValue('title3');

    // add overview block
    const addContentButton = await page.getByText('Add Content', {
      exact: true,
    });

    await addContentButton.click();

    const addOverviewButton = await page.getByText('Magazine Overview (automatic)', {
      exact: true,
    });

    await addOverviewButton.click();

    // try to add another overview
    await addContentButton.click();

    const magazineOverview = await page.getByText('Magazine Overview (automatic)');
    const publicationsOverview = await page.getByText('Publications Overview (automatic)');
    const newsOverview = await page.getByText('News Overview (automatic)');
    const nationalOverview = await page.getByText('National Dictionaries Overview (automatic)');
    const institutesOverview = await page.getByText('Institutes Overview (automatic)');

    await expect(magazineOverview).not.toBeVisible();
    await expect(publicationsOverview).not.toBeVisible();
    await expect(newsOverview).not.toBeVisible();
    await expect(nationalOverview).not.toBeVisible();
    await expect(institutesOverview).not.toBeVisible();

  });

  test('only allows 1 link block per page in Admin UI', async ({
    page,
  }) => {
    // create an overview page
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    // fill title
    const heroBlock = await page.locator('#field-hero');

    const titleField = await heroBlock.locator('.rich-text-lexical')
      .nth(0)
      .locator('.ContentEditable__root');

    await titleField.fill('title3');

    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    const slugField = await page.locator('#field-slug');

    await expect(slugField)
      .toHaveValue('title3');

    // add link
    const addContentButton = await page.getByText('Add Content', {
      exact: true,
    });

    await addContentButton.click();

    const drawer = await page.locator('.drawer__content');

    const addLinkButton = await drawer.getByText('Links', {
      exact: true,
    });

    await addLinkButton.click();

    // try to add link overview
    await addContentButton.click();

    await expect(addLinkButton).not.toBeVisible();
  });

  test('only allows 1 download block per page in Admin UI', async ({
    page,
  }) => {
    // create an overview page
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    // fill title
    const heroBlock = await page.locator('#field-hero');

    const titleField = await heroBlock.locator('.rich-text-lexical')
      .nth(0)
      .locator('.ContentEditable__root');

    await titleField.fill('title3');

    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    const slugField = await page.locator('#field-slug');

    await expect(slugField)
      .toHaveValue('title3');

    // add link
    const addContentButton = await page.getByText('Add Content', {
      exact: true,
    });

    await addContentButton.click();

    const drawer = await page.locator('.drawer__content');

    const addDownloadButton = await drawer.getByText('Downloads', {
      exact: true,
    });

    await addDownloadButton.click();

    // try to add link overview
    await addContentButton.click();

    await expect(addDownloadButton).not.toBeVisible();
  });

});
