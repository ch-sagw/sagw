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

    const teaserInput = await page.locator('#field-overviewPageProps .ContentEditable__root');

    const heroField = await page.locator('#field-hero .rich-text-lexical:first-of-type .ContentEditable__root')
      .nth(0);
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

  test('correctly adopts adminTitle from event details (event detail page)', async ({
    page,
  }) => {
    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/eventDetailPage/create');
    await page.waitForLoadState('networkidle');

    const eventTitle = await page.locator('#field-eventDetails .render-fields .rich-text-lexical')
      .first()
      .locator('.ContentEditable__root');
    const dateField = await page.locator('#field-eventDetails__date input');
    const externalLinkText = await page.locator('#field-link .render-fields .rich-text-lexical')
      .nth(1)
      .locator('.ContentEditable__root');
    const externalLink = await page.locator('#field-link__externalLink');

    await eventTitle.fill('foo bar$ baz');
    await dateField.fill('2025-08-31');
    await externalLinkText.fill('some event');
    await externalLink.fill('https://www.foo.bar');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    await page.waitForURL(/http:\/\/localhost:3000\/admin\/collections\/eventDetailPage\/[a-f0-9]+$/u);

    const heading = page.locator('.doc-header__title.render-title');

    await expect(heading)
      .toHaveText('foo bar$ baz');

    // test api response
    const url = page.url();
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const res = await fetch(`http://localhost:3000/api/eventDetailPage/${id}`);
    const newsPage = await res.json();

    await expect(newsPage.adminTitle)
      .toBe('foo bar$ baz');
  });

  test('correctly transforms lexical to plaintext', async ({
    page,
  }) => {
    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage/create');
    await page.waitForLoadState('networkidle');

    const teaserInput = await page.locator('#field-overviewPageProps .ContentEditable__root');

    const heroField = await page.locator('#field-hero .rich-text-lexical:first-of-type .ContentEditable__root')
      .nth(0);
    const dateField = await page.locator('#field-hero__date input');
    const hyphenButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-softHyphenButton');
    const superscriptButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-superscript');
    const subscriptButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-subscript');

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

    const newsPage = await res.json();

    await expect(newsPage.adminTitle)
      .toBe('News Detail Page Hero Title Transformtestsuperscriptsubscript');
  });
});
