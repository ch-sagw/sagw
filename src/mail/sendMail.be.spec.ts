import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import {
  expect,
  test,
} from '@playwright/test';
import { generateCollectionsExceptPages } from '@/test-helpers/collections-generator';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { waitForResendMail } from '@/test-helpers/resend';

test.describe('Resend', () => {
  beforeEachAcceptCookies();

  test('correctly sends mail after submitting custom form', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    const tenant = await getTenant();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const marker = `send-mail-${time}`;
    const resendRecipient = 'delivered@resend.dev';

    await generateCollectionsExceptPages({
      tenant: tenant || '',
    });

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
    const forms = await payload.find({
      collection: 'forms',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    await payload.update({
      collection: 'forms',
      data: {
        ...forms.docs[1],
        mailSubject: `Playwright contact form ${marker}`,
        recipientMail: resendRecipient,
      },
      id: forms.docs[1].id,
    });

    await payload.update({
      collection: 'homePage',
      data: {
        content: [
          {
            blockType: 'formBlock',
            form: forms.docs[1],
          },
        ],
      },
      id: home.docs[0].id,
    });

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
    await mailField.fill(`mail-${time}@foo.bar`);
    await textareaField.fill(`textarea ${marker}`);
    await checkboxField.click();

    const sentAfterMs = Date.now();

    await submit.click();

    // expect success message
    const notification = page.getByText('Submit title success', {
      exact: true,
    });

    await expect(notification)
      .toBeVisible();

    if (!process.env.RESEND_KEY) {
      throw new Error('RESEND_KEY is missing.');
    }

    const receivedMail = await waitForResendMail({
      apiKey: process.env.RESEND_KEY,
      sentAfterMs,
      subjectIncludes: marker,
      to: resendRecipient,
    });

    await expect(receivedMail.last_event)
      .toBeTruthy();
  });
});

