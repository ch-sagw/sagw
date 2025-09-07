import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('Slug field', () => {
  beforeEachPayloadLogin();

  test('gets populated correctly', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const heroField = await page.locator('#field-hero .ContentEditable__root');
    const hyphenButton = await page.locator('#field-hero .toolbar-popup__button-softHyphenButton');
    const superscriptButton = await page.locator('#field-hero .toolbar-popup__button-superscript');
    const subscriptButton = await page.locator('#field-hero .toolbar-popup__button-subscript');

    await heroField.fill('Sample Detail. Page. $name üöä');

    await hyphenButton.click();
    await heroField.pressSequentially('hyphen');
    await superscriptButton.click();
    await heroField.pressSequentially('sup');
    await subscriptButton.click();
    await heroField.pressSequentially('sub');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    const title = await page.getByRole('heading', {
      name: 'Sample Detail. Page.',
    });

    await expect(title)
      .toBeVisible();

    const slugField = await page.locator('#field-slug');

    await expect(slugField)
      .toHaveValue('sample-detail-page-dollarname-uoahyphensupsub');

  });

  test('checks for unique slug in same tenant', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const heroField = await page.locator('#field-hero .ContentEditable__root');

    await heroField.fill('Sample Detail. Page. $name üöä');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    const errorToast = await page.getByText('Slug "sample-detail-page-dollarname-uoa" already exists in this tenant');

    await expect(errorToast)
      .toBeVisible();

    // set correct slug
    await heroField.fill('Sample Detail. Page with unique name');
    await saveButton.click();

  });

  test('does not error if slug exists in other tenant', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const heroField = await page.locator('#field-hero .ContentEditable__root');

    await heroField.fill('Detail page title NOT-SAGW');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    const title = await page.getByRole('heading', {
      name: 'Detail page title NOT-SAGW',
    });

    await expect(title)
      .toBeVisible();

    const slugField = await page.locator('#field-slug');

    await expect(slugField)
      .toHaveValue('detail-page-title-not-sagw');

    // reset title and slug, so not to disturb other sagw/no-sagw specific tests
    await heroField.fill('Detail page title sagw after testing');
    await saveButton.click();
    await expect(slugField)
      .toHaveValue('detail-page-title-not-sagw');

  });
});
