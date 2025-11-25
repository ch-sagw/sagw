import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('NonBreakingSpace', () => {
  beforeEachPayloadLogin();

  test('correctly displays in rte field', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const rteField = await page.locator('#field-hero .rich-text-lexical:first-of-type .ContentEditable__root')
      .nth(0);
    const nbspButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-nonBreakingSpaceButton');

    await rteField.fill('detailpagetitle-non-breaking-space');
    await nbspButton.click();
    await rteField.pressSequentially('bar');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Publish changes',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    const title = await page.getByRole('heading', {
      name: 'detailpagetitle-non-breaking-space bar',
    });

    await expect(title)
      .toBeVisible();

    await expect(rteField)
      .toHaveScreenshot();
  });

  test('has correct api payload', async () => {
    const detailPagesRes = await fetch('http://localhost:3000/api/detailPage?where[slug][equals]=detailpagetitle-non-breaking-spacebar');
    const detailPagesData = await detailPagesRes.json();

    await expect(detailPagesData.docs.length)
      .toBeGreaterThanOrEqual(1);

    const [detailPageData] = detailPagesData.docs;
    const [, heroTitle] = detailPageData.hero.title.root.children[0].children;

    await expect(heroTitle.text)
      .toBe('\u00A0');

    await expect(heroTitle.type)
      .toBe('unicode-char-nbsp');

  });
});
