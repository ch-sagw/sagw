import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('adminTitle', () => {
  beforeEachPayloadLogin();

  test('correctly adopts adminTitle from hero field', async ({
    page,
  }) => {
    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage/create');
    await page.waitForLoadState('networkidle');

    const teaserInput = await page.getByRole('textbox', {
      name: 'Teaser Text',
    });

    const heroField = await page.locator('#field-hero .ContentEditable__root');
    const dateField = await page.locator('#field-hero__date input');

    await teaserInput.fill('foo');
    await heroField.fill('News Detail Page Hero Title');
    await dateField.fill('2025-08-31');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    await page.waitForURL(/http:\/\/localhost:3000\/admin\/collections\/newsDetailPage\/[a-f0-9]+$/u);
    await page.getByRole('heading', {
      name: 'Hero Title',
    });

    // test api response
    const url = page.url();
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const res = await fetch(`http://localhost:3000/api/newsDetailPage/${id}`);
    const newsPage = await res.json();

    await expect(newsPage.adminTitle)
      .toBe('News Detail Page Hero Title');
  });

  test('correctly transforms lexical to plaintext', async ({
    page,
  }) => {
    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage/create');
    await page.waitForLoadState('networkidle');

    const teaserInput = await page.getByRole('textbox', {
      name: 'Teaser Text',
    });

    const heroField = await page.locator('#field-hero .ContentEditable__root');
    const dateField = await page.locator('#field-hero__date input');
    const hyphenButton = await page.locator('#field-hero .toolbar-popup__button-softHyphenButton');
    const superscriptButton = await page.locator('#field-hero .toolbar-popup__button-superscript');
    const subscriptButton = await page.locator('#field-hero .toolbar-popup__button-subscript');

    await teaserInput.fill('foo');
    await heroField.fill('News Detail Page Hero Title Transform');
    await hyphenButton.click();
    await heroField.pressSequentially('test');
    await dateField.fill('2025-08-31');
    await superscriptButton.click();
    await heroField.pressSequentially('superscript');
    await subscriptButton.click();
    await heroField.pressSequentially('subscript');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    await page.waitForURL(/http:\/\/localhost:3000\/admin\/collections\/newsDetailPage\/[a-f0-9]+$/u);
    await page.getByRole('heading', {
      name: 'Hero Title',
    });

    // test api response
    const url = page.url();
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const res = await fetch(`http://localhost:3000/api/newsDetailPage/${id}`);

    console.log(`http://localhost:3000/api/newsDetailPage/${id}`);

    const newsPage = await res.json();

    await expect(newsPage.adminTitle)
      .toBe('News Detail Page Hero Title Transformtestsuperscriptsubscript');
  });
});
