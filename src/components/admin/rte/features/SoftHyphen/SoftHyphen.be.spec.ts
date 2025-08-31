import {
  expect,
  test,
} from '@playwright/test';

test.describe('Softhyphen', () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/');
    await page.waitForLoadState('load');

    const loginButton = await page.getByRole('button', {
      name: 'Anmelden',
    });

    await loginButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('correctly displays in rte field', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const rteField = await page.locator('#field-hero .ContentEditable__root');
    const hyphenButton = await page.locator('#field-hero .toolbar-popup__button-softHyphenButton');

    await rteField.fill('detailpagetitle');
    await hyphenButton.click();
    await rteField.pressSequentially('bar');

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
      name: 'detailpagetitlebar',
    });

    await expect(title)
      .toBeVisible();

    await expect(rteField)
      .toHaveScreenshot();
  });

  test('has correct api payload', async () => {
    const detailPagesRes = await fetch('http://localhost:3000/api/detailPage?where[adminTitle][equals]=detailpagetitlebar');
    const detailPagesData = await detailPagesRes.json();

    await expect(detailPagesData.docs.length)
      .toBeGreaterThanOrEqual(1);

    const [detailPageData] = detailPagesData.docs;
    const [, heroTitle] = detailPageData.hero.title.root.children[0].children;

    await expect(heroTitle.text)
      .toBe('\u00AD');

    await expect(heroTitle.type)
      .toBe('unicode-char');

  });
});
