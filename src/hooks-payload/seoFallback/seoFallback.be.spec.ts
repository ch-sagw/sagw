import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('seoFallback', () => {
  beforeEachPayloadLogin();

  test('page inherits seo from home', async ({
    page,
  }) => {

    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage/create');
    await page.waitForLoadState('networkidle');

    const teaserInput = await page.locator('.ContentEditable__root')
      .nth(0);
    const heroField = await page.locator('.ContentEditable__root')
      .nth(0);
    const dateField = await page.locator('#field-hero__date input');

    await teaserInput.fill('foo');
    await heroField.fill('seo test news detail page');
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
      name: 'bar',
    });

    // fetch sagw image
    const imageResponse = await fetch('http://localhost:3000/api/images?where[alt][equals]=SAGW%20image');
    const image = await imageResponse.json();

    // test api response
    const url = page.url();
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const res = await fetch(`http://localhost:3000/api/newsDetailPage/${id}`);
    const newsPage = await res.json();

    await expect(newsPage.meta.seo.title)
      .toBe('SEO Title SAGW');

    await expect(newsPage.meta.seo.description)
      .toBe('SEO Description SAGW');

    await expect(newsPage.meta.seo.image[0].id)
      .toBe(image.id);

  });
});
