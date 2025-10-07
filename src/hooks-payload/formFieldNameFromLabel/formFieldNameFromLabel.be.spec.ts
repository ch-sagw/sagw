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
    const title = await page.locator('.ContentEditable__root')
      .nth(0);
    const buttonLabel = await page.locator('#field-submitButtonLabel');
    const recipientMail = await page.locator('#field-recipientMail');
    const subject = await page.locator('#field-mailSubject');

    const successBlock = await page.locator('#field-submitSuccess');
    const errorBlock = await page.locator('#field-submitError');

    const successTitle = await successBlock.locator('.rich-text-lexical')
      .nth(0)
      .locator('.ContentEditable__root');
    const successText = await successBlock.locator('.rich-text-lexical')
      .nth(1)
      .locator('.ContentEditable__root');

    const errorTitle = await errorBlock.locator('.rich-text-lexical')
      .nth(0)
      .locator('.ContentEditable__root');
    const errorText = await errorBlock.locator('.rich-text-lexical')
      .nth(1)
      .locator('.ContentEditable__root');

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

    const label1 = await firstBlock.locator('.ContentEditable__root')
      .nth(0);
    const placeholder1 = await firstBlock.getByLabel('Placeholder');
    const error1 = await firstBlock.locator('.ContentEditable__root')
      .nth(1);

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
