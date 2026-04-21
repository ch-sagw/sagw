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
  generateDetailPage, generateInstituteDetailPage, generateNationalDictionaryDetailPage, getHomeId,
} from '@/test-helpers/collections-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('Language copy', () => {
  beforeEachPayloadLogin();

  test('detail page: does not error and copies values', async ({
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

    const langOptions = await copyToSelectField.getByText('Italiano');

    await langOptions.click();

    // copy button
    const copyButton = await page.locator('.copy-locale-data__sub-header button');

    await copyButton.click();

    // verify we're on the correct language
    const langButtonNew = await langSelect.locator('.localizer-button__current-label');

    await expect(langButtonNew)
      .toHaveText('Italiano');

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

  test('institue detail page: does not error and copies values', async ({
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

    await generateInstituteDetailPage({
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

    await page.goto('http://localhost:3000/admin/collections/instituteDetailPage?depth=1&limit=10');
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

    const langOptions = await copyToSelectField.getByText('Italiano');

    await langOptions.click();

    // copy button
    const copyButton = await page.locator('.copy-locale-data__sub-header button');

    await copyButton.click();

    // verify we're on the correct language
    const langButtonNew = await langSelect.locator('.localizer-button__current-label');

    await expect(langButtonNew)
      .toHaveText('Italiano');

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

  test('national dictionary detail page: does not error and copies values', async ({
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

    await generateNationalDictionaryDetailPage({
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

    await page.goto('http://localhost:3000/admin/collections/nationalDictionaryDetailPage?depth=1&limit=10');
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

    const langOptions = await copyToSelectField.getByText('Italiano');

    await langOptions.click();

    // copy button
    const copyButton = await page.locator('.copy-locale-data__sub-header button');

    await copyButton.click();

    // verify we're on the correct language
    const langButtonNew = await langSelect.locator('.localizer-button__current-label');

    await expect(langButtonNew)
      .toHaveText('Italiano');

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

  test('footer: does not error and copies localized values', async ({
    page,
  }) => {

    await deleteSetsPages();
    await deleteOtherCollections();

    const time = (new Date())
      .getTime();

    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    console.log('1');

    const payload = await getPayloadCached();

    const footer = await payload.find({
      collection: 'footer',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    await payload.update({
      collection: 'footer',
      data: {
        legal: {
          cookieSettings: simpleRteConfig('Cookie-Einstellungen'),
          copyright: simpleRteConfig('Copyright'),
          dataPrivacy: simpleRteConfig(`Footer legal ${time}`),
          impressum: simpleRteConfig('Impressum'),
        },
      },
      id: footer.docs[0].id,
      locale: 'de',
    });

    console.log('3');

    const langSelect = await page.locator('.localizer.app-header__localizer');

    await langSelect.click();

    const germanLang = await page.locator('.localizer__locale-code[data-locale="de"]');

    await germanLang.click({
      force: true,
    });

    await page.goto(`http://localhost:3000/admin/collections/footer/${footer.docs[0].id}`);
    await page.waitForLoadState('networkidle');

    const threeDotsButton = await page.locator('.popup.doc-controls__popup button.popup-button');

    await threeDotsButton.click({
      force: true,
    });

    const duplicateButton = await page.locator('#copy-locale-data__button');

    await duplicateButton.click();

    const copyToSelectField = await page.locator('#field-toLocale .field-type__wrap');

    await copyToSelectField.click();

    const langOptions = await copyToSelectField.getByText('Italiano');

    await langOptions.click();

    const copyButton = await page.locator('.copy-locale-data__sub-header button');

    await copyButton.click();

    const langButtonNew = await langSelect.locator('.localizer-button__current-label');

    await expect(langButtonNew)
      .toHaveText('Italiano');

    await expect(page.locator('.document-fields')
      .getByText(`Footer legal ${time}`, {
        exact: true,
      }))
      .toBeVisible();

    await langSelect.click();

    await germanLang.click({
      force: true,
    });
  });

  test('header: does not error and copies localized values', async ({
    page,
  }) => {

    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detailPage = await generateDetailPage({
      locale: 'de',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `header target ${time}`,
    });

    const payload = await getPayloadCached();
    const header = await payload.find({
      collection: 'header',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    await payload.update({
      collection: 'header',
      data: {
        metanavigation: {
          metaLinks: [
            {
              linkExternal: {
                externalLink: 'https://www.example.com',
                externalLinkText: simpleRteConfig('Meta'),
              },
              linkType: 'external',
            },
          ],
        },
        navigation: {
          navItems: [
            {
              description: simpleRteConfig(''),
              navItemLink: {
                documentId: detailPage.id,
                slug: 'detailPage',
              },
              navItemText: simpleRteConfig(`Header nav ${time}`),
            },
          ],
        },
        tenant,
      },
      id: header.docs[0].id,
      locale: 'de',
    });

    const langSelect = await page.locator('.localizer.app-header__localizer');

    await langSelect.click();

    const germanLang = await page.locator('.localizer__locale-code[data-locale="de"]');

    await germanLang.click({
      force: true,
    });

    await page.goto(`http://localhost:3000/admin/collections/header/${header.docs[0].id}`);
    await page.waitForLoadState('networkidle');

    const threeDotsButton = await page.locator('.popup.doc-controls__popup button.popup-button');

    await threeDotsButton.click({
      force: true,
    });

    const duplicateButton = await page.locator('#copy-locale-data__button');

    await duplicateButton.click();

    const copyToSelectField = await page.locator('#field-toLocale .field-type__wrap');

    await copyToSelectField.click();

    const langOptions = await copyToSelectField.getByText('Italiano');

    await langOptions.click();

    const copyButton = await page.locator('.copy-locale-data__sub-header button');

    await copyButton.click();

    const langButtonNew = await langSelect.locator('.localizer-button__current-label');

    await expect(langButtonNew)
      .toHaveText('Italiano');

    await expect(page.locator('.document-fields')
      .getByText(`Header nav ${time}`, {
        exact: true,
      }))
      .toBeVisible();

    await langSelect.click();

    await germanLang.click({
      force: true,
    });
  });

});
