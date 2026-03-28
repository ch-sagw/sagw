import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import {
  expect,
  Page,
  test,
} from '@playwright/test';
import { generateCollectionsExceptPages } from '@/test-helpers/collections-generator';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  waitForBrevoConfirmationLink,
  waitForBrevoContactListMembership,
} from '@/test-helpers/brevo';
import { deleteUser } from '@/mail/helpers';
import { Form } from '@/payload-types';

const fillAndSubmitForm = async ({
  email,
  page,
}: {
  email: string;
  page: Page,
}): Promise<number> => {
  const sentAfterMs = Date.now();

  // go to home
  await page.goto('http://localhost:3000/de');
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');

  const form = await page.locator('form')
    .nth(0);
  const submit = await form.locator('button');

  const mailField = await form.getByLabel('e-mail');
  const nameField = await form.getByLabel('Vorname');
  const lastNameField = await form.getByLabel('Nachname');
  const checkboxField = await form.getByText('Data privacy checkbox SAGW');
  const radioField = await form.getByText('Deutsch');

  await radioField.click();
  await mailField.fill(email);
  await nameField.fill('name');
  await lastNameField.fill('nachname');
  await checkboxField.click();

  await submit.click();

  // expect success message
  const notification = page.getByText('Newsletter Submit title success', {
    exact: true,
  });

  await expect(notification)
    .toBeVisible({
      timeout: 15_000,
    });

  return sentAfterMs;
};

const prepareContentAndSubmitForm = async ({
  page,
  email,
}: {
  page: Page;
  email: string;
}): Promise<{
  sentAfterMs: number,
  newsletterForm: Form,
}> => {
  await deleteSetsPages();
  await deleteOtherCollections();
  const payload = await getPayloadCached();
  const tenant = await getTenant();

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
  const newsletterForm = forms.docs.find((entry) => entry.isNewsletterForm === 'newsletter');

  if (!newsletterForm) {
    throw new Error('newsletter form not found.');
  }

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'formBlock',
          form: newsletterForm,
        },
      ],
    },
    id: home.docs[0].id,
  });

  const sentAfterMs = await fillAndSubmitForm({
    email,
    page,
  });

  return {
    newsletterForm,
    sentAfterMs,
  };

};

test.describe('Correctly signs up for Newsletter', () => {
  beforeEachAcceptCookies();

  test('with regular double-opt-in flow', async ({
    page,
  }) => {
    const time = (new Date())
      .getTime();
    const email = `vorhall23+sagwnewsletterplaywright${time}@gmail.com`;

    test.skip(!process.env.BREVO_TOKEN, 'BREVO_TOKEN is required for this test.');
    const brevoTimeoutMs = process.env.CI
      ? 180_000
      : 120_000;

    try {
      const {
        newsletterForm,
        sentAfterMs,
      } = await prepareContentAndSubmitForm({
        email,
        page,
      });

      // expect success message
      const notification = page.getByText('Newsletter Submit title success', {
        exact: true,
      });

      await expect(notification)
        .toBeVisible({
          timeout: 15_000,
        });

      if (!newsletterForm) {
        throw new Error('Form not found');
      }

      const {
        newsletterFields,
      } = newsletterForm;
      const listId = Number(newsletterFields?.newsletterListId);
      const listIdTemp = Number(newsletterFields?.newsletterTemporaryListId);

      if (!Number.isFinite(listId) || !Number.isFinite(listIdTemp)) {
        throw new Error('newsletter list IDs are missing in the generated form.');
      }

      await waitForBrevoContactListMembership({
        apiKey: process.env.BREVO_TOKEN as string,
        email,
        requiredListId: listIdTemp,
        timeoutMs: brevoTimeoutMs,
      });

      const confirmationLink = await waitForBrevoConfirmationLink({
        apiKey: process.env.BREVO_TOKEN as string,
        sentAfterMs,
        timeoutMs: brevoTimeoutMs,
        to: email,
      });

      await page.goto(confirmationLink);

      await waitForBrevoContactListMembership({
        apiKey: process.env.BREVO_TOKEN as string,
        email,
        forbiddenListId: listIdTemp,
        requiredListId: listId,
        timeoutMs: brevoTimeoutMs,
      });
    } finally {
      await deleteUser({
        email,
      });
    }
  });

  test('sign-up -> do not confirm -> sign-up again', async ({
    page,
  }) => {
    const time = (new Date())
      .getTime();
    const email = `vorhall23+sagwnewsletterplaywright${time}@gmail.com`;

    test.skip(!process.env.BREVO_TOKEN, 'BREVO_TOKEN is required for this test.');
    const brevoTimeoutMs = process.env.CI
      ? 180_000
      : 120_000;

    try {

      // submit form
      const {
        newsletterForm,
      } = await prepareContentAndSubmitForm({
        email,
        page,
      });

      const {
        newsletterFields,
      } = newsletterForm;
      const listId = Number(newsletterFields?.newsletterListId);
      const listIdTemp = Number(newsletterFields?.newsletterTemporaryListId);

      if (!Number.isFinite(listId) || !Number.isFinite(listIdTemp)) {
        throw new Error('newsletter list IDs are missing in the generated form.');
      }

      // submit form a second time
      const sentAfterMs = await fillAndSubmitForm({
        email,
        page,
      });

      await waitForBrevoContactListMembership({
        apiKey: process.env.BREVO_TOKEN as string,
        email,
        requiredListId: listIdTemp,
        timeoutMs: brevoTimeoutMs,
      });

      const confirmationLink = await waitForBrevoConfirmationLink({
        apiKey: process.env.BREVO_TOKEN as string,
        sentAfterMs,
        timeoutMs: brevoTimeoutMs,
        to: email,
      });

      await page.goto(confirmationLink);

      await waitForBrevoContactListMembership({
        apiKey: process.env.BREVO_TOKEN as string,
        email,
        forbiddenListId: listIdTemp,
        requiredListId: listId,
        timeoutMs: brevoTimeoutMs,
      });
    } finally {
      await deleteUser({
        email,
      });
    }
  });
});
