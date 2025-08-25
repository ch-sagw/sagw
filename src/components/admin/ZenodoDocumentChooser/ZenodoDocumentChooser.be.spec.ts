import {
  expect,
  Locator, test,
} from '@playwright/test';

test.describe('Add Zenodo document', () => {
  let zenodoInput: Locator;
  let zenodoButton: Locator;
  let saveButton: Locator;
  let zenodoList: Locator;

  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://0.0.0.0:3000/admin/collections/zenodoDocuments/create');
    await page.waitForLoadState('load');

    const createNewButton = await page.getByText('Neu erstellen', {
      exact: true,
    });

    await createNewButton.click();

    zenodoInput = page.getByTestId('zenodo-input');
    zenodoButton = page.getByTestId('zenodo-button');
    saveButton = page.getByRole('button', {
      name: 'Speichern',
    });
    zenodoList = page.getByTestId('zenodo-list');
  });

  test('api returns proper data', async () => {
    const foo = 'bar';

    await expect(foo)
      .toEqual('bar');
  });

  test('search and validate list items', async () => {
    await zenodoInput.fill('15126918');
    await zenodoButton.click();

    const lastItem = zenodoList.getByRole('listitem')
      .nth(5);

    await expect(zenodoList)
      .toBeVisible();
    await expect(lastItem)
      .toBeVisible();
    await expect(lastItem)
      .toHaveText('https://zenodo.org/api/records/15126918/files/source_data.xlsx/content (xlsx, 0.04 MB)');
  });

  test('results disappear after input change', async () => {
    await zenodoInput.fill('15126918');
    await zenodoButton.click();

    await expect(zenodoList)
      .toBeVisible();

    await zenodoInput.fill('1');

    await expect(zenodoList)
      .not.toBeVisible();
  });

  test('validation error on invalid input', async ({
    page,
  }) => {
    await saveButton.click();

    const errorToast = await page.getByText('Die folgenden Felder sind nicht korrekt (4):');

    await expect(errorToast)
      .toBeVisible();
  });

  test('validation error on existing zenodo id', async ({
    page,
  }) => {
    await zenodoInput.fill('1512691');
    await zenodoButton.click();
    await expect(zenodoList)
      .toBeVisible();
    await saveButton.click();

    const errorToast2 = await page.getByText('Das folgende Feld ist nicht korrekt:zenodoId');

    await expect(errorToast2)
      .toBeVisible();
  });

  test('sucessfull save on valid input', async ({
    page,
  }) => {
    await zenodoInput.fill('15126918');
    await zenodoButton.click();
    await expect(zenodoList)
      .toBeVisible();
    await saveButton.click();

    const successToast = await page.getByText('Zenodo Document erfolgreich erstellt.');

    await expect(successToast)
      .toBeVisible();
  });

  test('returns proper api structure', async ({
    page,
  }) => {

    // add a new document
    await zenodoInput.fill('15126911');
    await zenodoButton.click();
    await expect(zenodoList)
      .toBeVisible();
    await saveButton.click();

    const successToast = await page.getByText('Zenodo Document erfolgreich erstellt.');

    await expect(successToast)
      .toBeVisible();

    // test the return value of the payload api
    const res = await fetch('http://0.0.0.0:3000/api/zenodoDocuments?where[zenodoId][equals]=15126911');
    const json = await res.json();

    await expect(json.docs.length)
      .toEqual(1);

    const [doc] = json.docs;

    await expect(doc.zenodoId)
      .toEqual('15126911');

    await expect(doc.title)
      .toEqual('Initial Reports of the Deep Sea Drilling Project - Volume 6');

    await expect(doc.publicationDate)
      .toEqual('1971');

    await expect(doc.files.length)
      .toEqual(2);

    await expect(doc.files[0].link)
      .toEqual('https://zenodo.org/api/records/15126912/files/Leg 6 Volume.zip/content');

    await expect(doc.files[0].format)
      .toEqual('zip');

    await expect(doc.files[0].size)
      .toEqual(205.03);
  });
});
