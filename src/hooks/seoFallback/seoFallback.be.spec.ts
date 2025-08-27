import {
  expect,
  test,
} from '@playwright/test';

test.describe('seoFallback', () => {
  test('page inherits seo from home', async ({
    page,
  }) => {
    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetail/create');
    await page.waitForLoadState('load');

    const teaserInput = await page.getByRole('textbox', {
      name: 'Teaser Text',
    });

    const heroField = await page.locator('#field-hero .ContentEditable__root');

    await teaserInput.fill('foo');
    await heroField.fill('bar');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Speichern',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    await page.waitForURL(/http:\/\/localhost:3000\/admin\/collections\/newsDetail\/[a-f0-9]+$/u);
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
    const res = await fetch(`http://localhost:3000/api/newsDetail/${id}`);
    const newsPage = await res.json();

    await expect(newsPage.meta.seo.title)
      .toBe('SEO Title SAGW');

    await expect(newsPage.meta.seo.description)
      .toBe('SEO Description SAGW');

    await expect(newsPage.meta.seo.image[0].id)
      .toBe(image.id);

  });
});
