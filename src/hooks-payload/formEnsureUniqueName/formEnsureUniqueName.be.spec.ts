import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('forms', () => {
  beforeEachPayloadLogin();

  test('ensure unique label / name for all fields', async ({
    page,
  }) => {
    // create a news detail page
    await page.goto('http://localhost:3000/admin/collections/forms/create');
    await page.waitForLoadState('networkidle');

    const addFieldButton = await page.getByText('Field hinzufügen', {
      exact: true,
    });

    await addFieldButton.click();

    const textBlock = await page.getByText('Text', {
      exact: true,
    });

    await textBlock.click();

    await addFieldButton.click();

    await textBlock.click();

    const firstBlock = await page.locator('#fields-row-0');
    const secondBlock = await page.locator('#fields-row-1');

    const label1 = await firstBlock.getByLabel('Label');
    const placeholder1 = await firstBlock.getByLabel('Placeholder');
    const error1 = await firstBlock.getByLabel('Field Error');

    const label2 = await secondBlock.getByLabel('Label');
    const placeholder2 = await secondBlock.getByLabel('Placeholder');
    const error2 = await secondBlock.getByLabel('Field Error');

    await label1.fill('label');
    await placeholder1.fill('placeholder');
    await error1.fill('error');

    await label2.fill('label');
    await placeholder2.fill('placeholder');
    await error2.fill('error');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();

    // find error
    const error = await page.locator('.field-error');

    await expect(error)
      .toHaveText('Duplicate label "label" is not allowed.');
  });
});
