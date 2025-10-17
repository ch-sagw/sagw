import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('news detail page', () => {
  beforeEachPayloadLogin();

  test('adds forms block on create', async ({
    page,
  }) => {
    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage/create');
    await page.waitForLoadState('networkidle');

    const contentField = await page.locator('#field-content');
    const formField = await contentField.getByLabel('Form');

    await expect(formField)
      .toBeVisible();

    // properly save page with valid values to not disturb other tests

    const teaserInput = await page.locator('.ContentEditable__root')
      .nth(0);

    const heroField = await page.locator('.ContentEditable__root')
      .nth(0);
    const dateField = await page.locator('#field-hero__date input');

    await teaserInput.fill('foo');
    await heroField.fill('News Detail Page with initial Forms block');
    await dateField.fill('2025-08-31');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    await page.locator('.payload-toast-container [data-close-button="true"]');
  });
});
