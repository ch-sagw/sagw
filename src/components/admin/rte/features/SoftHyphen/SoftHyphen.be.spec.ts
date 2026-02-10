import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

test.describe('Softhyphen', () => {
  beforeEachPayloadLogin();
  beforeEachAcceptCookies();

  test('correctly displays in hero field', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const rteField = await page.locator('#field-hero .rich-text-lexical:first-of-type .ContentEditable__root')
      .nth(0);
    const hyphenButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-softHyphenButton');

    await rteField.fill('detailpagetitle');
    await hyphenButton.click();
    await rteField.pressSequentially('bar');

    const navigationTitle = await page.locator('#field-navigationTitle');
    const parentPage = await page.locator('#field-parentPage');
    const sidebar = await page.locator('.document-fields__sidebar-fields');

    await navigationTitle.fill('nav title');
    await parentPage.click();

    const homePageParentPage = await sidebar.getByText('Home Page');

    await homePageParentPage.click();

    const metaTab = await page.getByText('Meta', {
      exact: true,
    });

    const contentTab = await page.getByText('Content', {
      exact: true,
    });

    await metaTab.click();

    const metaTitle = await page.locator('#field-meta__seo__title');
    const metaDescription = await page.locator('#field-meta__seo__description');

    await metaTitle.fill('foo');
    await metaDescription.fill('foo');

    await contentTab.click();

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
      .toBe('unicode-char-shy');

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
    const hyphenButton = await rteField.locator('.rich-text-lexical .toolbar-popup__button-softHyphenButton');

    await rteInputField.fill('detailpagetitle');
    await hyphenButton.click();
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

  test('correctly renders in frontend', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const rteField = await page.locator('#field-hero .rich-text-lexical:first-of-type .ContentEditable__root')
      .nth(0);
    const hyphenButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-softHyphenButton');

    await rteField.fill('detailpagetitle');
    await hyphenButton.click();
    await rteField.pressSequentially('bar');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Publish changes',
    });

    await saveButton.click();

    const addContentButton = await page.getByText('Add Content', {
      exact: true,
    });

    await addContentButton.click();

    const addTextBlockButton = await page.getByText('Richtext', {
      exact: true,
    });

    await addTextBlockButton.click();

    const rteField2 = await page.locator('#field-content .blocks-field__row');
    const rteInputField2 = await rteField2.locator('.rich-text-lexical .ContentEditable__root');
    const hyphenButton2 = await rteField2.locator('.rich-text-lexical .toolbar-popup__button-softHyphenButton');

    await rteInputField2.fill('detailpagetitle');
    await hyphenButton2.click();
    await rteInputField2.pressSequentially('bar');

    // save
    await saveButton.click();

    await page.goto('http://localhost:3000/de/detailpagetitlebar');
    await page.waitForLoadState('networkidle');

    const texts = await page.getByText('detailpagetitlebar');

    const titleText = await texts.nth(0)
      .textContent();
    const rteText = await texts.nth(1)
      .textContent();

    await expect(titleText)
      .toMatch(/detailpagetitle\u00ADbar/u);
    await expect(rteText)
      .toMatch(/detailpagetitle\u00ADbar/u);

  });
});
