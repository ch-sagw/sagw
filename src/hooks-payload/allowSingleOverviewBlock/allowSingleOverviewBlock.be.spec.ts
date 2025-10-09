import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('Overview blocks', () => {
  beforeEachPayloadLogin();

  test.beforeEach(async ({
    page,
  }) => {
    // create an overview page
    await page.goto('http://localhost:3000/admin/collections/overviewPage/create');
    await page.waitForLoadState('networkidle');

    // fill title
    const heroBlock = await page.locator('#field-hero');

    const titleField = await heroBlock.locator('.rich-text-lexical')
      .nth(0)
      .locator('.ContentEditable__root');

    await titleField.fill('title3');

    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    const slugField = await page.locator('#field-slug');

    await expect(slugField)
      .toHaveValue('title3');

    // add overview block
    const addContentButton = await page.getByText('Content hinzufügen', {
      exact: true,
    });

    await addContentButton.click();

    const addOverviewButton = await page.getByText('Magazine Overview (automatic)', {
      exact: true,
    });

    await addOverviewButton.click();
  });

  test('only allows 1 overview block per page', async ({
    page,
  }) => {
    // try to add another overview
    const addContentButton = await page.getByText('Content hinzufügen', {
      exact: true,
    });

    await addContentButton.click();

    const magazineOverview = await page.getByText('Magazine Overview (automatic)');
    const publicationsOverview = await page.getByText('Publications Overview (automatic)');
    const newsOverview = await page.getByText('News Overview (automatic)');
    const nationalOverview = await page.getByText('National Dictionaries Overview (automatic)');
    const institutesOverview = await page.getByText('Institutes Overview (automatic)');

    await expect(magazineOverview).not.toBeVisible();
    await expect(publicationsOverview).not.toBeVisible();
    await expect(newsOverview).not.toBeVisible();
    await expect(nationalOverview).not.toBeVisible();
    await expect(institutesOverview).not.toBeVisible();

  });

  test('does not allow to duplicate an overview block', async ({
    page,
  }) => {

    // try to duplicate
    const contentBlock = await page.locator('#content-row-0');
    const contextButton = await contentBlock.locator('.popup-button.array-actions__button');

    await contextButton.click();

    const duplicate = await contentBlock.locator('.array-actions__duplicate');

    await duplicate.click();

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();
    await page.waitForLoadState('networkidle');

    // expect error
    const error = await page.getByText('2 Fehler');
    const mainError = await page.getByText('Die folgenden Felder sind nicht korrekt (2)');

    await expect(error)
      .toBeVisible();

    await expect(mainError)
      .toBeVisible();
  });
});
