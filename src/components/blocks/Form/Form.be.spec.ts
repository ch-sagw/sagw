import { getTenant } from '@/app/providers/TenantProvider.server';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  expect,
  test,
} from '@playwright/test';

test.describe('Custom Form', () => {
  beforeEachAcceptCookies();
  test('correctly validates email', async ({
    page,
  }) => {

    // #########################################
    // Empty home content and add proper content
    // #########################################

    const payload = await getPayloadCached();
    const tenant = await getTenant();

    try {
      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const i18nGlobals = await payload.find({
        collection: 'i18nGlobals',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      await payload.update({
        collection: 'i18nGlobals',
        data: {
          ...i18nGlobals.docs[0],
          forms: {
            dataPrivacyCheckbox: {
              dataPrivacyCheckboxText: simpleRteConfig('Data privacy checkbox SAGW'),
              errorMessage: simpleRteConfig('Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen'),
            },
          },
        },
        id: i18nGlobals.docs[0].id,
      });

      // empty homepage
      await payload.update({
        collection: 'homePage',
        data: {
          content: [],
        },
        id: home.docs[0].id,
      });

      // add real content

      // add contact form
      const contactForm = await payload.create({
        collection: 'forms',
        data: {
          colorMode: 'dark',
          fields: [
            {
              blockType: 'textBlockForm',
              fieldError: simpleRteConfig('Geben Sie Ihren Namen an.'),
              fieldWidth: 'half',
              label: simpleRteConfig('Name'),
              name: 'name',
              placeholder: 'Ihr Name',
              required: true,
            },
            {
              blockType: 'emailBlock',
              fieldError: simpleRteConfig('Geben Sie ihre E-Mail-Adresse an.'),
              fieldWidth: 'half',
              label: simpleRteConfig('E-Mail'),
              name: 'email',
              placeholder: 'Ihre E-Mail Adresse',
              required: true,
            },
            {
              blockType: 'textareaBlock',
              fieldError: simpleRteConfig('Geben Sie ihren Kommentar an.'),
              fieldWidth: 'full',
              label: simpleRteConfig('Kommentar'),
              name: 'comment',
              placeholder: 'Ihr Kommentar',
              required: true,
            },
            {
              blockType: 'checkboxBlock',
              fieldError: simpleRteConfig('Bitte akzeptieren Sie die Hinweise zum Datenschutz.'),
              fieldWidth: 'full',
              label: simpleRteConfig('Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.'),
              name: 'checkbox-custom',
              required: true,
            },
            {
              blockType: 'radioBlock',
              fieldError: simpleRteConfig('Sie müssen eine Auswahl treffen'),
              fieldWidth: 'full',
              items: [
                {
                  label: simpleRteConfig('Deutsch'),
                  value: 'deutsch',
                },
                {
                  label: simpleRteConfig('Französisch'),
                  value: 'french',
                },
              ],
              label: simpleRteConfig('In welcher Sprache möchten Sie den Newsletter erhalten?'),
              name: 'language-select',
              required: true,
            },
          ],
          isNewsletterForm: 'custom',
          mailSubject: 'Form submission on SAGW',
          recipientMail: 'delivered@resend.dev',
          showPrivacyCheckbox: false,
          submitButtonLabel: 'Abschicken',
          submitError: {
            text: simpleRteConfig('Submit text error'),
            title: simpleRteConfig('Submit title error'),
          },
          submitSuccess: {
            text: simpleRteConfig('Submit text success'),
            title: simpleRteConfig('Submit title success SAGW'),
          },
          subtitle: simpleRteConfig('Subtitle for contact Form'),
          tenant,
          title: simpleRteConfig('Contact Form SAGW'),
        },
      });

      // add newsletter form
      const newsletterForm = await payload.create({
        collection: 'forms',
        data: {
          colorMode: 'dark',
          isNewsletterForm: 'newsletter',
          newsletterFields: {
            actionText: 'Erneut senden',
            email: {
              fieldError: simpleRteConfig('Bitte geben Sie die E-Mail Adresse an.'),
              fieldWidth: 'full',
              label: simpleRteConfig('E-Mail'),
              placeholder: 'Ihre E-Mail Adresse',
            },
            firstName: {
              fieldError: simpleRteConfig('Bitte geben Sie Ihren Vornamen an.'),
              fieldWidth: 'half',
              label: simpleRteConfig('Vorname'),
              placeholder: 'Ihr Vorname',
            },
            includeLanguageSelection: 'yes',
            lastName: {
              fieldError: simpleRteConfig('Bitte geben Sie Ihren Nachnamen an.'),
              fieldWidth: 'half',
              label: simpleRteConfig('Nachname'),
              placeholder: 'Ihr Nachname',
            },
          },
          recipientMail: 'delivered@resend.dev',
          showPrivacyCheckbox: true,
          submitButtonLabel: 'Abschicken',
          submitError: {
            text: simpleRteConfig('Newsletter Submit text error SAGW'),
            title: simpleRteConfig('Newsletter Submit title error SAGW'),
          },
          submitSuccess: {
            text: simpleRteConfig('Newsletter Submit text success SAGW'),
            title: simpleRteConfig('Newsletter Submit title success SAGW'),
          },
          subtitle: simpleRteConfig('Subtitle for Newsletter Form SAGW'),
          tenant,
          title: simpleRteConfig('Newsletter Form SAGW'),
        },
      });

      await payload.update({
        collection: 'homePage',
        data: {
          content: [
            {
              blockType: 'formBlock',
              form: contactForm,
            },
            {
              blockType: 'formBlock',
              form: newsletterForm,
            },
          ],
        },
        id: home.docs[0].id,
      });

    } catch (e) {
      console.log(e);

      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // test
    // #########################################

    // go to home
    await page.goto('http://localhost:3000/de');
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

    const mailError2 = await form.getByText('Geben Sie ihre E-Mail-Adresse an.', {
      exact: true,
    });

    await (await mailField.elementHandle())?.waitForElementState('stable');

    await expect(mailError2)
      .not.toBeVisible();
  });

  test('correctly validates text / textarea', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/de');
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
    await page.goto('http://localhost:3000/de');
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
    await page.goto('http://localhost:3000/de');
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
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .first();

    const submit = await form.locator('button');

    const mailField = await form.getByLabel('e-mail');
    const nameField = await form.getByLabel('name');
    const textareaField = await form.getByLabel('kommentar');
    const checkboxField = await form.locator('#checkbox-ich-habe-die-hinweise-zum-datenschutz-gelesen-und-akzeptiere-sie');

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
    await page.goto('http://localhost:3000/de');
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
    await page.goto('http://localhost:3000/de');
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
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);

    const submit = await form.locator('button');

    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    // expect form error: required

    const nameError = await form.getByText('Bitte geben Sie Ihren Vornamen an.', {
      exact: true,
    });

    await expect(nameError)
      .toBeVisible();

    // fill valid value
    const nameField = await form.getByLabel('Vorname');

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
    await page.goto('http://localhost:3000/de');
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
    await page.goto('http://localhost:3000/de');
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
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);

    const submit = await form.locator('button');

    const mailField = await form.getByLabel('e-mail');
    const nameField = await form.getByLabel('Vorname');
    const lastNameField = await form.getByLabel('Nachname');
    const checkboxField = await form.locator('input[type="checkbox"]');

    await nameField.fill('firstname');
    await lastNameField.fill('lastname');
    await mailField.fill('testmail');
    await checkboxField.click({
      force: true,
    });

    // expect same values
    await submit.click();

    await (await form.elementHandle())?.waitForElementState('stable');

    await expect(nameField)
      .toHaveValue('firstname');
    await expect(lastNameField)
      .toHaveValue('lastname');
    await expect(mailField)
      .toHaveValue('testmail');
    await expect(checkboxField)
      .toBeChecked();
  });

  test('correctly submits form', async ({
    page,
  }) => {
    // go to home
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const form = await page.locator('form')
      .nth(1);
    const submit = await form.locator('button');

    const mailField = await form.getByLabel('e-mail');
    const nameField = await form.getByLabel('Vorname');
    const lastNameField = await form.getByLabel('Nachname');
    const checkboxField = await form.getByText('Data privacy checkbox SAGW');
    const radioField = await form.getByText('Deutsch');

    await radioField.click();
    await mailField.fill('mail@foo.bar');
    await nameField.fill('name');
    await lastNameField.fill('nachname');
    await checkboxField.click();

    await submit.click();

    // expect success message
    const notification = page.getByText('Newsletter Submit title success SAGW', {
      exact: true,
    });

    await expect(notification)
      .toBeVisible();
  });
});
