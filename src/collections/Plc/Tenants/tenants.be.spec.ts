import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('Tenants only show content from users tenant', () => {
  beforeEachPayloadLogin();

  test('images', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/images');
    await page.waitForLoadState('networkidle');

    const expectedImage = await page.getByText('sagw.png', {
      exact: true,
    });
    const notExpectedImage = await page.getByText('not-sagw.png', {
      exact: true,
    });

    await expect(expectedImage)
      .toBeVisible();
    await expect(notExpectedImage)
      .not.toBeVisible();
  });

  test('publication topic', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationTopics');
    await page.waitForLoadState('networkidle');

    const expectedTopic = await page.getByText('Publication Topic 1 SAGW', {
      exact: true,
    });
    const notExpectedTopic = await page.getByText('Publication Topic 1 NOTSAGW', {
      exact: true,
    });

    await expect(expectedTopic)
      .toBeVisible();
    await expect(notExpectedTopic)
      .not.toBeVisible();
  });

  test('publication type', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationTypes');
    await page.waitForLoadState('networkidle');

    const expectedType = await page.getByText('Publication Type 1 SAGW', {
      exact: true,
    });
    const notExpectedType = await page.getByText('Publication Type 1 NOTSAGW', {
      exact: true,
    });

    await expect(expectedType)
      .toBeVisible();
    await expect(notExpectedType)
      .not.toBeVisible();
  });

  test('forms', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/forms');
    await page.waitForLoadState('networkidle');

    const expectedForm = await page.getByText('Contact Form SAGW', {
      exact: true,
    });
    const notExpectedForm = await page.getByText('Contact Form NOT-SAGW', {
      exact: true,
    });

    await expect(expectedForm)
      .toBeVisible();
    await expect(notExpectedForm)
      .not.toBeVisible();
  });

  test('zenodo document', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments');
    await page.waitForLoadState('networkidle');

    const expectedDocument = await page.getByText('Sample Zenodo Document SAGW', {
      exact: true,
    });
    const notExpectedDocument = await page.getByText('Sample Zenodo Document NOTSAGW', {
      exact: true,
    });

    await expect(expectedDocument)
      .toBeVisible();
    await expect(notExpectedDocument)
      .not.toBeVisible();
  });

  test('home', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/homePage');
    await page.waitForLoadState('networkidle');

    const expectedDocument = await page.getByText('Home Title SAGW', {
      exact: true,
    });
    const notExpectedDocument = await page.getByText('Home Title NOT-SAGW', {
      exact: true,
    });

    await expect(expectedDocument)
      .toBeVisible();
    await expect(notExpectedDocument)
      .not.toBeVisible();
  });

  test('news detail page', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage');
    await page.waitForLoadState('networkidle');

    // show all entries
    const perPageButton = await page.locator('.page-controls .per-page');

    await perPageButton.click();

    const entries100 = await page.locator('.page-controls .popup__content')
      .getByText('100');

    await entries100.click();

    const expectedNews = await page.getByText('News 7 detail page title SAGW', {
      exact: true,
    });
    const notExpectedNews = await page.getByText('News 7 detail page title NOTSAGW', {
      exact: true,
    });

    await expect(expectedNews)
      .toBeVisible();
    await expect(notExpectedNews)
      .not.toBeVisible();
  });

  test('publication detail page', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationDetailPage');
    await page.waitForLoadState('networkidle');

    const expectedPublication = await page.getByText('Publication detail page title SAGW', {
      exact: true,
    });
    const notExpectedPublication = await page.getByText('Publication detail page title NOTSAGW', {
      exact: true,
    });

    await expect(expectedPublication)
      .toBeVisible();
    await expect(notExpectedPublication)
      .not.toBeVisible();
  });

  test('correctly filters available languages', async ({
    page,
  }) => {
    // disable french in tenant config, go to detail page and check
    // if french is no longer choosable in lang dropdown

    await page.goto('http://localhost:3000/admin/collections/tenants');
    await page.waitForLoadState('networkidle');

    const sagw = await page.locator('.cell-name a');

    await sagw.click();
    await page.waitForLoadState('networkidle');

    const fr = await page.getByRole('checkbox', {
      name: 'fr',
    });

    await fr.click({
      force: true,
    });

    const save = await page.getByRole('button', {
      name: 'Speichern',
    });

    await save.click();
    await page.waitForLoadState('networkidle');

    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const heroField = await page.locator('#field-hero .ContentEditable__root')
      .nth(0);

    await heroField.fill('Tenant Language test News Detail Page');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    const langSwitch = await page.getByLabel('Sprache');

    await langSwitch.click({
      force: true,
    });

    const enButton = await page.getByRole('button', {
      name: 'English',
    });

    const frButton = await page.getByRole('button', {
      name: 'Français',
    });

    await expect(enButton)
      .toBeVisible();

    await expect(frButton)
      .not.toBeVisible();
  });

});
