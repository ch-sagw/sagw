import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  getTenant, getTenantNonSagw,
} from '@/test-helpers/tenant-generator';
import {
  generateAllPageTypes, generateCollectionsExceptPages,
} from '@/test-helpers/collections-generator';

test.describe('Tenants only show content from users tenant', () => {
  beforeEachPayloadLogin();

  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();

    // add generic data
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const tenantNonSagw = await getTenantNonSagw();
    const time = (new Date())
      .getTime();

    const home = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const homeNonSagw = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenantNonSagw,
        },
      },
    });

    await generateAllPageTypes({
      home: home.docs[0].id,
      iterator: 1,
      tenant: tenant || '',
      time,
    });

    await generateAllPageTypes({
      home: homeNonSagw.docs[0].id,
      iterator: 2,
      tenant: tenantNonSagw || '',
      time,
    });

    await deleteOtherCollections();

    await generateCollectionsExceptPages({
      isSagw: true,
      tenant: tenant || '',
    });

    await generateCollectionsExceptPages({
      isSagw: false,
      tenant: tenantNonSagw || '',
    });

  });

  test('images', async ({
    page,
  }) => {
    const tenant = await getTenant();
    const tenantNonSagw = await getTenantNonSagw();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    await deleteOtherCollections();

    await payload.create({
      collection: 'images',
      data: {
        alt: `image sagw ${time}`,
        tenant,
      },
      filePath: 'src/seed/test-data/assets/sagw.png',
      locale: 'de',
      overrideAccess: true,
    });

    await payload.create({
      collection: 'images',
      data: {
        alt: `image not-sagw ${time}`,
        tenant: tenantNonSagw,
      },
      filePath: 'src/seed/test-data/assets/not-sagw.png',
      locale: 'de',
      overrideAccess: true,
    });

    await page.goto('http://localhost:3000/admin/collections/images');
    await page.waitForLoadState('networkidle');

    const expectedImage = await page.getByText(`image sagw ${time}`, {
      exact: true,
    });
    const notExpectedImage = await page.getByText(`image not-sagw ${time}`, {
      exact: true,
    });

    await expect(expectedImage)
      .toBeVisible();
    await expect(notExpectedImage)
      .not.toBeVisible();
  });

  test('publication topic', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationTopics');
    await page.waitForLoadState('networkidle');

    const expectedTopic = await page.getByText('Publication Topic sagw', {
      exact: true,
    });
    const notExpectedTopic = await page.getByText('Publication Topic non-sagw', {
      exact: true,
    });

    await expect(expectedTopic)
      .toBeVisible();
    await expect(notExpectedTopic)
      .not.toBeVisible();
  });

  test('publication type', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationTypes');
    await page.waitForLoadState('networkidle');

    const expectedType = await page.getByText('Publication Type sagw', {
      exact: true,
    });
    const notExpectedType = await page.getByText('Publication Type non-sagw', {
      exact: true,
    });

    await expect(expectedType)
      .toBeVisible();
    await expect(notExpectedType)
      .not.toBeVisible();
  });

  test('forms', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/forms');
    await page.waitForLoadState('networkidle');

    const expectedForm = await page.getByText('Contact Form sagw', {
      exact: true,
    });
    const notExpectedForm = await page.getByText('Contact Form non-sagw', {
      exact: true,
    });

    await expect(expectedForm)
      .toBeVisible();
    await expect(notExpectedForm)
      .not.toBeVisible();
  });

  test('zenodo document', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments');
    await page.waitForLoadState('networkidle');

    const expectedDocument = await page.getByText('Sample Zenodo Document sagw', {
      exact: true,
    });
    const notExpectedDocument = await page.getByText('Sample Zenodo Document non-sagw', {
      exact: true,
    });

    await expect(expectedDocument)
      .toBeVisible();
    await expect(notExpectedDocument)
      .not.toBeVisible();
  });

  test('home', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/homePage');
    await page.waitForLoadState('networkidle');

    const expectedDocument = await page.getByText('Home Title SAGW', {
      exact: true,
    });
    const notExpectedDocument = await page.getByText('Home Title NOT-SAGW', {
      exact: true,
    });

    await expect(expectedDocument)
      .toBeVisible();
    await expect(notExpectedDocument)
      .not.toBeVisible();
  });

  test('correctly filters available languages', async ({
    page,
  }) => {
    // disable french in tenant config, go to detail page and check
    // if french is no longer choosable in lang dropdown

    await page.goto('http://localhost:3000/admin/collections/tenants');
    await page.waitForLoadState('networkidle');

    const sagw = await page.locator('.cell-name a');

    await sagw.click();
    await page.waitForLoadState('networkidle');

    const fr = await page.getByRole('checkbox', {
      name: 'fr',
    });

    await fr.click({
      force: true,
    });

    const navigationTitle = await page.locator('#field-navigationTitle');
    const parentPage = await page.locator('#field-parentPage');
    const sidebar = await page.locator('.document-fields__sidebar-fields');

    await navigationTitle.fill('nav title');
    await parentPage.click();

    const homePageParentPage = await sidebar.getByText('Home Page');

    await homePageParentPage.click();

    const save = await page.getByRole('button', {
      name: 'Save',
    });

    await save.click();
    await page.waitForLoadState('networkidle');

    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const heroField = await page.locator('#field-hero .ContentEditable__root')
      .nth(0);

    await heroField.fill('Tenant Language test News Detail Page');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Publish changes',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    const langSwitch = await page.getByLabel('Locale');

    await langSwitch.click({
      force: true,
    });

    const enButton = await page.getByRole('button', {
      name: 'English',
    });

    const frButton = await page.getByRole('button', {
      name: 'Français',
    });

    await expect(enButton)
      .toBeVisible();

    await expect(frButton)
      .not.toBeVisible();

    await fr.click({
      force: true,
    });

    await saveButton.click();
  });

});
