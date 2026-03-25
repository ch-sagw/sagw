import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getTenantId } from '@/test-helpers/tenant-generator';
import {
  generateDetailPage, getHomeId,
} from '@/test-helpers/collections-generator';

test.describe('Language copy', () => {
  beforeEachPayloadLogin();

  test('does not error and copies values', async ({
    page,
  }) => {

    await deleteSetsPages();
    await deleteOtherCollections();

    // create a detail page
    const time = (new Date())
      .getTime();

    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    await generateDetailPage({
      locale: 'de',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail 1 ${time}`,
    });

    // ensure correct language
    const langSelect = await page.locator('.localizer.app-header__localizer');

    await langSelect.click();

    const germanLang = await page.locator('.localizer__locale-code[data-locale="de"]');

    await germanLang.click({
      force: true,
    });

    // go to detail page

    await page.goto('http://localhost:3000/admin/collections/detailPage?depth=1&limit=10');
    await page.waitForLoadState('networkidle');

    const detailPageEntry = await page.getByText(`detail 1 ${time}`);

    await detailPageEntry.click();

    await page.waitForLoadState('networkidle');

    // make language copy
    const threeDotsButton = await page.locator('.popup.doc-controls__popup button.popup-button');

    await threeDotsButton.click({
      force: true,
    });

    const duplicateButton = await page.locator('#copy-locale-data__button');

    await duplicateButton.click();

    // language copy overlay
    const copyToSelectField = await page.locator('#field-toLocale .field-type__wrap');

    await copyToSelectField.click();

    const langOptions = await copyToSelectField.getByText('Français');

    await langOptions.click();

    // copy button
    const copyButton = await page.locator('.copy-locale-data__sub-header button');

    await copyButton.click();

    // verify we're on the correct language
    const langButtonNew = await langSelect.locator('.localizer-button__current-label');

    await expect(langButtonNew)
      .toHaveText('Français');

    // verify hero content
    const heroField = await page.locator('#field-hero .rich-text-lexical:first-of-type p.LexicalEditorTheme__paragraph');

    await expect(heroField)
      .toHaveText(`detail 1 ${time}`);

    // verify meta content
    const metaTab = await page.locator('.tabs-field__tab-button')
      .nth(1);

    await metaTab.click();

    const metaTitle = await page.locator('#field-meta__seo__title');

    await expect(metaTitle)
      .toHaveValue('seo title');

    // reset language to german
    await langSelect.click();

    await await germanLang.click({
      force: true,
    });
  });

});
