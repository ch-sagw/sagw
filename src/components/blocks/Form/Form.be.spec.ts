import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import {
  expect,
  test,
} from '@playwright/test';

test.describe('Custom Form', () => {
  beforeEachAcceptCookies();
  test('correctly validates email', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .first();

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required
    const mailError = await form.getByText('Geben Sie ihre E-Mail-Adresse an.', {
      exact: true,
    });

    await expect(mailError)
      .toBeVisible();

    // expect form error: mail format
    const mailField = await form.getByLabel('e-mail');

    await mailField.fill('mail');
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(mailError)
      .toBeVisible();

    // fill valid value
    await mailField.fill('mail@foo.bar');

    // expect no error
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(mailError)
      .not.toBeVisible();
  });

  test('correctly validates text / textarea', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .first();

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form errors: required

    const nameError = await form.getByText('Geben Sie Ihren Namen an.', {
      exact: true,
    });
    const textareaError = await form.getByText('Geben Sie ihren Kommentar an.', {
      exact: true,
    });

    await expect(nameError)
      .toBeVisible();
    await expect(textareaError)
      .toBeVisible();

    // fill valid values
    const nameField = await form.getByLabel('name');
    const textareaField = await form.getByLabel('kommentar');

    await nameField.fill('name');
    await textareaField.fill('textarea');

    // expect no errors
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(nameError)
      .not.toBeVisible();

    await expect(textareaError)
      .not.toBeVisible();
  });

  test('correctly validates checkbox', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .first();

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required
    const checkboxError = await form.getByText('Bitte akzeptieren Sie die Hinweise zum Datenschutz.', {
      exact: true,
    });

    await expect(checkboxError)
      .toBeVisible();

    // fill valid values
    const checkboxField = await form.getByText('Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.');

    await checkboxField.click();

    // expect no errors
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(checkboxError)
      .not.toBeVisible();
  });

  test('correctly validates radio', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .first();

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required
    const radioError = await form.getByText('Sie müssen eine Auswahl treffen', {
      exact: true,
    });

    await expect(radioError)
      .toBeVisible();

    // fill valid values
    const radioField = await form.getByText('Deutsch');

    await radioField.click();

    // expect no errors
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(radioError)
      .not.toBeVisible();
  });

  test('fills correct values after validation errors', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .first();

    const submit = await form.locator('button');

    const mailField = await form.getByLabel('e-mail');
    const nameField = await form.getByLabel('name');
    const textareaField = await form.getByLabel('kommentar');
    const checkboxField = await form.locator('#ich-habe-die-hinweise-zum-datenschutz-gelesen-und-akzeptiere-sie');

    await nameField.fill('testname');
    await mailField.fill('testmail');
    await textareaField.fill('testtextarea');
    await checkboxField.click({
      force: true,
    });

    // expect same values
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(mailField)
      .toHaveValue('testmail');
    await expect(nameField)
      .toHaveValue('testname');
    await expect(textareaField)
      .toHaveValue('testtextarea');
    await expect(checkboxField)
      .toBeChecked();
  });

  test('correctly submits form', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .first();
    const submit = await form.locator('button');

    const mailField = await form.getByLabel('e-mail');
    const nameField = await form.getByLabel('name');
    const textareaField = await form.getByLabel('kommentar');
    const checkboxField = await form.getByText('Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.');
    const radioField = await form.getByText('Deutsch');

    await radioField.click();
    await nameField.fill('name');
    await mailField.fill('mail@foo.bar');
    await textareaField.fill('textarea');
    await checkboxField.click();

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect success message
    const notification = page.getByText('Submit title success SAGW', {
      exact: true,
    });

    await expect(notification)
      .toBeVisible();
  });
});

test.describe('Newsletter Form', () => {
  beforeEachAcceptCookies();

  test('correctly validates email', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required
    const mailError = await form.getByText('Bitte geben Sie die E-Mail Adresse an.', {
      exact: true,
    });

    await expect(mailError)
      .toBeVisible();

    // expect form error: mail format
    const mailField = await form.getByLabel('e-mail');

    await mailField.fill('mail');
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(mailError)
      .toBeVisible();

    // fill valid value
    await mailField.fill('mail@foo.bar');

    // expect no error
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(mailError)
      .not.toBeVisible();
  });

  test('correctly validates text', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required

    const nameError = await form.getByText('Bitte geben Sie Ihren Namen an.', {
      exact: true,
    });

    await expect(nameError)
      .toBeVisible();

    // fill valid value
    const nameField = await form.getByLabel('name');

    await nameField.fill('name');

    // expect no error
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(nameError)
      .not.toBeVisible();

  });

  test('correctly validates checkbox', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required
    const checkboxError = await form.getByText('Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen', {
      exact: true,
    });

    await expect(checkboxError)
      .toBeVisible();

    // fill valid values
    const checkboxField = await form.getByText('Data privacy checkbox SAGW');

    await checkboxField.click();

    // expect no errors
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(checkboxError)
      .not.toBeVisible();
  });

  test('correctly validates radio', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required
    const radioError = await form.getByText('Sie müssen eine Auswahl treffen', {
      exact: true,
    });

    await expect(radioError)
      .toBeVisible();

    // fill valid values
    const radioField = await form.getByText('Deutsch');

    await radioField.click();

    // expect no errors
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(radioError)
      .not.toBeVisible();
  });

  test('fills correct values after validation errors', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);

    const submit = await form.locator('button');

    const mailField = await form.getByLabel('e-mail');
    const nameField = await form.getByLabel('name');
    const checkboxField = await form.locator('input[type="checkbox"]');

    await nameField.fill('testname');
    await mailField.fill('testmail');
    await checkboxField.click({
      force: true,
    });

    // expect same values
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(nameField)
      .toHaveValue('testname');
    await expect(mailField)
      .toHaveValue('testmail');
    await expect(checkboxField)
      .toBeChecked();
  });

  test('correctly submits form', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);
    const submit = await form.locator('button');

    const mailField = await form.getByLabel('e-mail');
    const nameField = await form.getByLabel('name');
    const checkboxField = await form.getByText('Data privacy checkbox SAGW');
    const radioField = await form.getByText('Deutsch');

    await radioField.click();
    await mailField.fill('mail@foo.bar');
    await nameField.fill('name');
    await checkboxField.click();

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect success message
    const notification = page.getByText('Newsletter Submit title success SAGW', {
      exact: true,
    });

    await expect(notification)
      .toBeVisible();
  });
});
