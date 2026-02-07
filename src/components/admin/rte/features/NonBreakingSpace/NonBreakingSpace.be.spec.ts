import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';

test.describe('NonBreakingSpace', () => {
  beforeEachPayloadLogin();

  test('correctly displays in rte field', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
    const detailPagesRes = await fetch('http://localhost:3000/api/detailPage?where[slug][equals]=detailpagetitle-non-breaking-space-bar');
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

  test('correctly displays in textblock', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const heroField = await page.locator('#field-hero .rich-text-lexical:first-of-type .ContentEditable__root')
      .nth(0);

    await heroField.fill('detailpagetitle');

    const addContentButton = await page.getByText('Add Content', {
      exact: true,
    });

    await addContentButton.click();

    const addTextBlockButton = await page.getByText('Richtext', {
      exact: true,
    });

    await addTextBlockButton.click();

    const rteField = await page.locator('#field-content .blocks-field__row');
    const fieldToScreenshot = await rteField.locator('.LexicalEditorTheme__paragraph');
    const rteInputField = await rteField.locator('.rich-text-lexical .ContentEditable__root');
    const nbspButton = await rteField.locator('.rich-text-lexical .toolbar-popup__button-nonBreakingSpaceButton');

    await rteInputField.fill('detailpagetitle');
    await nbspButton.click();
    await rteInputField.pressSequentially('bar');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Publish changes',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // add another block to make sure that previous has finished loading
    await addContentButton.click();

    const addTextBlockButton2 = (await page.getByText('Richtext', {
      exact: true,
    })).nth(1);

    await addTextBlockButton2.click();

    await expect(fieldToScreenshot)
      .toHaveScreenshot();
  });
});
