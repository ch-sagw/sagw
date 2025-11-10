import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('Internal Link Chooser', () => {
  beforeEachPayloadLogin();

  // TODO: find stable solution
  /*
  test('shows available links in overlay context', async ({
    page,
  }) => {

    // go to consent page
    await page.goto('http://localhost:3000/admin/');
    await page.waitForLoadState('networkidle');

    const dashboard = await page.locator('.dashboard');
    const consentPageButton = await dashboard.getByText('Consent');

    await consentPageButton.click({
      force: true,
    });
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('load');

    const url1 =
    /http:\/\/localhost:3000\/admin\/collections\/consent\/[a-f0-9]+$/u;

    // fill rte field, select text and click link button
    const rte2Field =
    await page.locator('#field-banner__text .ContentEditable__root');

    await rte2Field.fill('some link content');
    await page.waitForRequest(url1);

    const element = await page.getByText('some link content');

    await (await element.elementHandle())?.waitForElementState('stable');

    await element.click();
    await page.keyboard.press('ControlOrMeta+A');

    const linkButton = await page
    .locator('#field-banner__text .toolbar-popup__button-link');

    await linkButton.click();

    // choose internal link and click dropdown

    await page.waitForRequest(url1);
    await page.waitForRequest(url1);
    await page.waitForRequest(url1);
    await page.waitForRequest(url1);
    await page.waitForRequest(url1);
    await page.waitForRequest(url1);
    await page.waitForRequest(url1);

    const internalLinkRadio = await page.getByText('Interne Verlinkung');

    await (await internalLinkRadio.elementHandle())?
    .waitForElementState('stable');

    await internalLinkRadio.click({
      force: true,
    });

    await page.waitForRequest(url1);

    const linksSection = await page.locator('#field-doc');

    const linksDropdown = await linksSection.getByText('Wert auswählen');

    await (await linksDropdown.elementHandle())?.waitForElementState('stable');

    await linksDropdown.click({
      force: true,
    });

    await Promise.all([
      page.waitForRequest('http://localhost:3000/api/magazineDetailPage'),
      page.waitForRequest('http://localhost:3000/api/overviewPage'),
      page.waitForRequest('http://localhost:3000/api/detailPage'),
      page.waitForRequest('http://localhost:3000/api/eventDetailPage'),
      page.waitForRequest('http://localhost:3000/api/newsDetailPage'),
      page.waitForRequest('http://localhost:3000/api/publicationDetailPage'),
      page
      .waitForRequest('http://localhost:3000/api/nationalDictionaryDetailPage'),
    ]);

    const link1 = await page.getByText('Home Page', {
      exact: true,
    });
    const link2 = await page.getByText('Overview page title SAGW', {
      exact: true,
    });
    const link3 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link4 = await page.getByText('Magazine detail page title SAGW', {
      exact: true,
    });
    const link5 = await page
    .getByText('Event detail page title SAGW (render link)', {
      exact: true,
    });
    const link6 = await page
    .getByText('Event detail page title SAGW (render detail page)', {
      exact: true,
    });
    const link7 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link8 = await page.getByText('News detail page title SAGW', {
      exact: true,
    });
    const link9 = await page.getByText('Publication detail page title SAGW', {
      exact: true,
    });

    await expect(link1)
      .toBeVisible();
    await expect(link2)
      .toBeVisible();
    await expect(link3)
      .toBeVisible();
    await expect(link4)
      .toBeVisible();
    await expect(link5)
      .toBeVisible();
    await expect(link6)
      .toBeVisible();
    await expect(link7)
      .toBeVisible();
    await expect(link8)
      .toBeVisible();
    await expect(link9)
      .toBeVisible();

  });
  */

  test('shows available links', async ({
    page,
  }) => {

    await page.goto('http://localhost:3000/admin/collections/header');
    await page.waitForLoadState('networkidle');

    const navItem1 = await page.locator('#navigation-navItems-row-0');

    const linkTargetInput = await navItem1.getByLabel('Nav Item Link');

    await (await linkTargetInput.elementHandle())?.waitForElementState('stable');

    await linkTargetInput.click();

    const link1 = await page.getByText('Home Page', {
      exact: true,
    });
    const link2 = await page.getByText('Overview page title SAGW', {
      exact: true,
    });
    const link3 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link4 = await page.getByText('Magazine detail page title SAGW', {
      exact: true,
    });
    const link6 = await page.getByText('Event 1 details title SAGW (render detail page)', {
      exact: true,
    });
    const link7 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link8 = await page.getByText('News 1 detail page title SAGW', {
      exact: true,
    });
    const link9 = await page.getByText('Publication detail page title SAGW', {
      exact: true,
    });

    await expect(link1)
      .toBeVisible();
    await expect(link2)
      .toBeVisible();
    await expect(link3)
      .toBeVisible();
    await expect(link4)
      .toBeVisible();
    await expect(link6)
      .toBeVisible();
    await expect(link7)
      .toBeVisible();
    await expect(link8)
      .toBeVisible();
    await expect(link9)
      .toBeVisible();

  });

  test('only shows link of current tenant', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/header');
    await page.waitForLoadState('networkidle');

    const navItem1 = await page.locator('#navigation-navItems-row-0');

    const linkTargetInput = await navItem1.getByLabel('Nav Item Link');

    await (await linkTargetInput.elementHandle())?.waitForElementState('stable');

    await linkTargetInput.click();

    const link1 = await page.getByText('Overview page title SAGW', {
      exact: true,
    });
    const link2 = await page.getByText('Overview page title NOT-SAGW', {
      exact: true,
    });

    await expect(link1)
      .toBeVisible();
    await expect(link2)
      .not.toBeVisible();
  });

  test('only shows published pages', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/header');
    await page.waitForLoadState('networkidle');

    const navItem1 = await page.locator('#navigation-navItems-row-0');

    const linkTargetInput = await navItem1.getByLabel('Nav Item Link');

    await (await linkTargetInput.elementHandle())?.waitForElementState('stable');

    await linkTargetInput.click();

    const draftPage = await page.getByText('Detail Page Lead', {
      exact: true,
    });

    const publishedPage = await page.getByText('Overview page title SAGW', {
      exact: true,
    });

    await expect(publishedPage)
      .toBeVisible();

    await expect(draftPage)
      .not.toBeVisible();
  });
});
