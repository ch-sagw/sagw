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
    // create a form
    await page.goto('http://localhost:3000/admin/collections/forms/create');
    await page.waitForSelector('#field-submitButtonLabel');
    await page.waitForLoadState('domcontentloaded');

    // fill global fields
    const buttonLabel = await page.locator('#field-submitButtonLabel');
    const recipientMail = await page.locator('#field-recipientMail');
    const subject = await page.locator('#field-mailSubject');

    await buttonLabel.fill('button label');
    await recipientMail.fill('foo@bar.com');
    await subject.fill('subject');

    // add 2 fields
    const addFieldButton = await page.getByText('Field hinzufügen', {
      exact: true,
    });

    await addFieldButton.waitFor({
      state: 'visible',
    });

    await addFieldButton.click();

    const textBlock = await page.getByText('Text', {
      exact: true,
    });

    await textBlock.click();

    await addFieldButton.waitFor({
      state: 'visible',
    });

    await addFieldButton.click();

    await textBlock.click();

    // fill fields for success/error
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

    await successTitle.fill('success title');
    await successText.fill('success text');
    await errorTitle.fill('error title');
    await errorText.fill('error text');

    // fill fields of block

    const firstBlock = await page.locator('#fields-row-0');
    const secondBlock = await page.locator('#fields-row-1');

    await firstBlock.waitFor({
      state: 'visible',
    });
    await secondBlock.waitFor({
      state: 'visible',
    });

    const label1 = await firstBlock.locator('.ContentEditable__root')
      .nth(0);
    const placeholder1 = await firstBlock.getByLabel('Placeholder');
    const error1 = await firstBlock.locator('.ContentEditable__root')
      .nth(1);

    const label2 = await secondBlock.locator('.ContentEditable__root')
      .nth(0);
    const placeholder2 = await secondBlock.getByLabel('Placeholder');
    const error2 = await secondBlock.locator('.ContentEditable__root')
      .nth(1);

    await label1.fill('label');
    await placeholder1.fill('placeholder');
    await error1.fill('error');

    await label2.fill('label', {
      force: true,
    });
    await placeholder2.fill('placeholder');
    await error2.fill('error');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Änderungen veröffentlichen',
    });

    await saveButton.click();
    await page.waitForLoadState('networkidle', {
      timeout: 10000,
    });

    // expect error
    const mainError = await page.getByText('The following field is invalid: Label');
    const fieldError = await page.locator('.field-error');

    await expect(mainError)
      .toBeVisible();
    await expect(fieldError)
      .toHaveText('Duplicate label "label" is not allowed.');
  });
});
