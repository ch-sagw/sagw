import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { generateForm } from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';

test.describe('forms', () => {
  beforeEachPayloadLogin();

  test('ensure unique label / name for all fields', async ({
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
    const form = await generateForm(tenant);

    await page.goto(`http://localhost:3000/admin/collections/forms/${form}`);
    await page.waitForLoadState('networkidle');

    const fieldsTab = await page.getByRole('button', {
      name: 'fields',
    });

    await fieldsTab.click();

    const addFieldButton = await page.getByRole('button', {
      name: 'Add Field',
    });

    await addFieldButton.click();

    const dialog = await page.locator('dialog.payload__modal-item ');
    const addTextfieldButton = dialog.getByRole('button', {
      exact: true,
      name: 'Text',
    });

    await addTextfieldButton.click();

    const newRow = await page.locator('#fields-row-1');

    await newRow.waitFor({
      state: 'visible',
    });

    const label1 = await newRow.locator('.ContentEditable__root')
      .nth(0);
    const placeholder1 = await newRow.getByLabel('Placeholder');
    const error1 = await newRow.locator('.ContentEditable__root')
      .nth(1);

    await label1.fill('name');
    await placeholder1.fill('placeholder');
    await error1.fill('error');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Save',
    });

    await saveButton.click();
    await page.waitForLoadState('networkidle', {
      timeout: 10000,
    });

    // expect error
    const mainError =
      await page.getByText('The following field is invalid: Label');
    const fieldError = await page.locator('.field-error');

    await expect(mainError)
      .toBeVisible();
    await expect(fieldError)
      .toHaveText('Duplicate label "name" is not allowed.');
  });
});
