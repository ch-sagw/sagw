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

    await heroField.fill('Sample Detail. Page. $name üöä');

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
      .toHaveValue('sample-detail-page-dollarname-uoa');

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

  test('gets populated correctly fake', async ({
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

  });
});
