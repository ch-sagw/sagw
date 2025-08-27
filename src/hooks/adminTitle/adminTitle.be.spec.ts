import {
  expect,
  test,
} from '@playwright/test';

test.describe('adminTitle', () => {
  test('correctly adopts adminTitle from hero field', async ({
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
    await heroField.fill('Hero Title');

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

    // test api response
    const url = page.url();
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    const res = await fetch(`http://localhost:3000/api/newsDetail/${id}`);
    const newsPage = await res.json();

    await expect(newsPage.adminTitle)
      .toBe('Hero Title');
  });
});
