import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

test.describe('forms', () => {
  beforeEachPayloadLogin();

  test('correctly derives name from label', async ({
    page,
  }) => {
    // create a form
    await page.goto('http://localhost:3000/admin/collections/forms/create');
    await page.waitForLoadState('networkidle');

    // fill global fields
    const title = await page.locator('#field-title');
    const buttonLabel = await page.locator('#field-submitButtonLabel');
    const recipientMail = await page.locator('#field-recipientMail');
    const subject = await page.locator('#field-mailSubject');
    const successTitle = await page.locator('#field-submitSuccess__title');
    const successText = await page.locator('#field-submitSuccess__text');
    const errorTitle = await page.locator('#field-submitError__title');
    const errorText = await page.locator('#field-submitError__text');

    await title.fill('title');
    await buttonLabel.fill('button label');
    await recipientMail.fill('foo@bar.com');
    await subject.fill('subject');
    await successTitle.fill('success title');
    await successText.fill('success text');
    await errorTitle.fill('error title');
    await errorText.fill('error text');

    // add block

    const addFieldButton = await page.getByText('Field hinzufügen', {
      exact: true,
    });

    await addFieldButton.click();

    const textBlock = await page.getByText('Text', {
      exact: true,
    });

    await textBlock.click();

    const firstBlock = await page.locator('#fields-row-0');

    const label1 = await firstBlock.getByLabel('Label');
    const placeholder1 = await firstBlock.getByLabel('Placeholder');
    const error1 = await firstBlock.getByLabel('Field Error');

    await label1.fill('$4_20-"^3asd-%&*"+');
    await placeholder1.fill('placeholder');
    await error1.fill('error');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    // expect specific name derived from label
    await saveButton.click();

    const hiddenNameField = await firstBlock.locator('#field-fields__0__name');

    await expect(hiddenNameField)
      .toHaveValue('4_20-3asd-');

  });
});
