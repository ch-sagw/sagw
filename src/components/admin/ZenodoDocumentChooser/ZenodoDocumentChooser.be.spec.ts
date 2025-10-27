import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('Add Zenodo document', () => {
  beforeEachPayloadLogin();

  test('search and validate list items', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments/create');
    await page.waitForLoadState('networkidle');

    const zenodoInput = page.getByTestId('zenodo-input');
    const zenodoButton = page.getByTestId('zenodo-button');
    const zenodoList = page.getByTestId('zenodo-list');

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

  test('results disappear after input change', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments/create');
    await page.waitForLoadState('networkidle');

    const zenodoInput = page.getByTestId('zenodo-input');
    const zenodoButton = page.getByTestId('zenodo-button');
    const zenodoList = page.getByTestId('zenodo-list');

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
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments/create');
    await page.waitForLoadState('networkidle');

    const saveButton = page.getByRole('button', {
      name: 'Save',
    });

    await saveButton.click();

    const errorToast = await page.getByText('The following fields are invalid (4):');

    await expect(errorToast)
      .toBeVisible();
  });

  test('validation error on existing zenodo id', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments/create');
    await page.waitForLoadState('networkidle');

    const zenodoInput = page.getByTestId('zenodo-input');
    const zenodoButton = page.getByTestId('zenodo-button');

    await zenodoInput.fill('1512691');
    await zenodoButton.click();

    const errorMessage = await page.getByTestId('id-already-there');

    await expect(errorMessage)
      .toBeVisible();
  });

  test('sucessfull save on valid input', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments/create');
    await page.waitForLoadState('networkidle');

    const zenodoInput = page.getByTestId('zenodo-input');
    const zenodoButton = page.getByTestId('zenodo-button');
    const saveButton = page.getByRole('button', {
      name: 'Save',
    });
    const zenodoList = page.getByTestId('zenodo-list');

    await zenodoInput.fill('15126918');
    await zenodoButton.click();
    await expect(zenodoList)
      .toBeVisible();
    await saveButton.click();

    const successToast = await page.getByText('Zenodo Document successfully created.');

    await expect(successToast)
      .toBeVisible();
  });

  test('returns proper api response', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments/create');
    await page.waitForLoadState('networkidle');

    const zenodoInput = page.getByTestId('zenodo-input');
    const zenodoButton = page.getByTestId('zenodo-button');
    const saveButton = page.getByRole('button', {
      name: 'Save',
    });
    const zenodoList = page.getByTestId('zenodo-list');

    // add a new document
    await zenodoInput.fill('8888');
    await zenodoButton.click();
    await expect(zenodoList)
      .toBeVisible();
    await saveButton.click();

    const successToast = await page.getByText('Zenodo Document successfully created.');

    await expect(successToast)
      .toBeVisible();

    // test the return value of the payload api
    const res = await fetch('http://localhost:3000/api/zenodoDocuments?where[zenodoId][equals]=8888');
    const json = await res.json();

    await expect(json.docs.length)
      .toEqual(1);

    const [doc] = json.docs;

    await expect(doc.zenodoId)
      .toEqual('8888');

    await expect(doc.title)
      .toEqual('CALCULATING THE SMARANOACHE FUNCTION WITHOUT FACTORISING');

    await expect(doc.publicationDate)
      .toEqual('2000-04-30');

    await expect(doc.files.length)
      .toEqual(1);

    await expect(doc.files[0].link)
      .toEqual('https://zenodo.org/api/records/8888/files/CalcSFFactorising.pdf/content');

    await expect(doc.files[0].format)
      .toEqual('pdf');

    await expect(doc.files[0].size)
      .toEqual(0.15);
  });
});
