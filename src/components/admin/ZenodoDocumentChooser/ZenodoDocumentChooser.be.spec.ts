import {
  expect,
  test,
} from '@playwright/test';

test.describe('Add Zenodo Document', () => {
  test('step1', async ({
    page,
  }) => {

    /*
    await page.goto('http://localhost:3000/admin');
    await page.waitForLoadState('load');

    const zenodoDocuments = await page.getByText('Zenodo Documents')
      .nth(1);

    await zenodoDocuments.click({
      force: true,
    });

    */
    // await page.waitForURL('**/collections/zenodoDocuments');
    // await page.waitForLoadState('domcontentloaded');

    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments');
    await page.waitForLoadState('load');

    const createNewButton = await page.getByText('Neu erstellen', {
      exact: true,
    });

    await createNewButton.click();

    // 1. issue search and make sure that:
    // - list is visible
    // - list has 6 items
    // - last item contains correct text

    const zenodoInput = await page.getByTestId('zenodo-input');
    const zenodoButton = await page.getByTestId('zenodo-button');
    const saveButton = await page.getByRole('button', {
      name: 'Speichern',
    });

    await zenodoInput.fill('15126918');
    await zenodoButton.click();

    const zenodoList = await page.getByTestId('zenodo-list');
    const lastItem = await zenodoList.getByRole('listitem')
      .nth(5);

    await expect(zenodoList)
      .toBeVisible();

    await expect(lastItem)
      .toBeVisible();

    await expect(lastItem)
      .toHaveText('https://zenodo.org/api/records/15126918/files/source_data.xlsx/content (xlsx, 0.04 MB)');

    // 2. change input and make sure that list disappears

    await zenodoInput.fill('1');

    await expect(zenodoList)
      .not.toBeVisible();

    // 3. click save and expect validation error
    await saveButton.click();

    const errorToast = await page.getByText('Die folgenden Felder sind nicht korrekt (4):');

    await expect(errorToast)
      .toBeVisible();

    // 4. add zenodo id which is already existend in collection and expect error
    await zenodoInput.fill('1512691');
    await zenodoButton.click();
    await expect(zenodoList)
      .toBeVisible();
    await saveButton.click();

    const errorToast2 = await page.getByText('Das folgende Feld ist nicht korrekt:zenodoId');

    await expect(errorToast2)
      .toBeVisible();

    // fill correct value, validate and save, expect success toast
    await zenodoInput.fill('15126918');
    await zenodoButton.click();
    await expect(zenodoList)
      .toBeVisible();
    await saveButton.click();

    const successToast = await page.getByText('Zenodo Document erfolgreich erstellt.');

    await expect(successToast)
      .toBeVisible();

    // make api call to check correct data

  });

});
