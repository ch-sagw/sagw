import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import configPromise from '@/payload.config';
import { getPayload } from 'payload';

test.describe('seoFallback', () => {
  beforeEachPayloadLogin();

  test('page inherits seo from home', async ({
    page,
  }) => {
    const payload = await getPayload({
      config: configPromise,
    });

    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage/create');
    await page.waitForLoadState('networkidle');

    const teaserInput = await page.locator('.ContentEditable__root')
      .nth(0);
    const heroField = await page.locator('.ContentEditable__root')
      .nth(1);
    const dateField = await page.locator('#field-hero__date input');

    await teaserInput.fill('foo');
    await heroField.fill('seo test news detail page');
    await dateField.fill('2025-08-31');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Publish changes',
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
    const imageResponse = await payload.find({
      collection: 'images',
      where: {
        alt: {
          equals: 'SAGW image',
        },
      },
    });

    // test api response
    const url = page.url();
    const parts = url.split('/');
    const id = parts[parts.length - 1];

    const newsPage = await payload.findByID({
      collection: 'newsDetailPage',
      id,
    });

    await expect(newsPage?.meta?.seo?.title)
      .toBe('SEO Title SAGW');

    await expect(newsPage?.meta?.seo?.description)
      .toBe('SEO Description SAGW');

    await expect(newsPage?.meta?.seo?.image)
      .toBe(imageResponse.docs[0].id);

  });
});
