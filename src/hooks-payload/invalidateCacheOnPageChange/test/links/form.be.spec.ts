import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';

test('invalidates if target links in form changes slug (sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();
  const tenant = await getTenantId({
    isSagw: true,
    time,
  });
  const home = await getHomeId({
    isSagw: true,
    tenant,
  });
  const detailPage1 = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  const detailPage2 = await generateDetailPage({
    tenant,
    title: `link target 1 ${time}`,
  });

  const detailPage3 = await generateDetailPage({
    tenant,
    title: `link target 2 ${time}`,
  });

  const detailPage4 = await generateDetailPage({
    tenant,
    title: `link target 3 ${time}`,
  });

  // form with data privacy checkbox, radio and checkbox (all with links)
  const form = await payload.create({
    collection: 'forms',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'checkboxBlock',
          fieldError: simpleRteConfig('Bitte akzeptieren Sie die Hinweise zum Datenschutz.'),
          fieldWidth: 'full',
          label: sampleRteWithLink({
            documentId: detailPage2.id,
            slug: 'detailPage',
            text: 'checkbox link',
          }),
          name: 'checkbox-custom',
          required: true,
        },
        {
          blockType: 'radioBlock',
          fieldError: simpleRteConfig('Sie müssen eine Auswahl treffen'),
          fieldWidth: 'full',
          items: [
            {
              label: simpleRteConfig('Französisch'),
              value: 'french',
            },
          ],
          label: sampleRteWithLink({
            documentId: detailPage3.id,
            slug: 'detailPage',
            text: 'radio link',
          }),
          name: 'language-select',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Form submission on SAGW',
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: simpleRteConfig('Submit text error'),
        title: simpleRteConfig('Submit title error'),
      },
      submitSuccess: {
        text: simpleRteConfig('Submit text success'),
        title: simpleRteConfig(`Submit title success ${tenant.toUpperCase()}`),
      },
      subtitle: simpleRteConfig('Subtitle for contact Form'),
      tenant,
      title: simpleRteConfig(`Contact Form ${tenant.toUpperCase()}`),
    },
  });

  // add link to data privacy checkbox
  const dataPrivacyDocs = await payload.find({
    collection: 'i18nGlobals',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const [dataPrivacyContent] = dataPrivacyDocs.docs;

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      ...dataPrivacyContent,
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: sampleRteWithLink({
            documentId: detailPage4.id,
            slug: 'detailPage',
            text: 'privacy link',
          }),
          errorMessage: simpleRteConfig('text'),
        },
      },
    },
    id: dataPrivacyContent.id,
  });

  // add form to detail page
  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'formBlock',
          form,
        },
      ],
    },
    id: detailPage1.id,
  });

  // test detail 2

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`link target changed ${time}`),
      },
    },
    id: detailPage2.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

  // test detail 3

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`link target changed 2 ${time}`),
      },
    },
    id: detailPage3.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

  // test detail 4

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`link target changed 3 ${time}`),
      },
    },
    id: detailPage4.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates if target links in form changes slug (non-sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();
  const tenant = await getTenantId({
    isSagw: false,
    time,
  });
  const home = await getHomeId({
    isSagw: false,
    tenant,
  });
  const detailPage1 = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  const detailPage2 = await generateDetailPage({
    tenant,
    title: `link target 1 ${time}`,
  });

  const detailPage3 = await generateDetailPage({
    tenant,
    title: `link target 2 ${time}`,
  });

  const detailPage4 = await generateDetailPage({
    tenant,
    title: `link target 3 ${time}`,
  });

  // form with data privacy checkbox, radio and checkbox (all with links)
  const form = await payload.create({
    collection: 'forms',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'checkboxBlock',
          fieldError: simpleRteConfig('Bitte akzeptieren Sie die Hinweise zum Datenschutz.'),
          fieldWidth: 'full',
          label: sampleRteWithLink({
            documentId: detailPage2.id,
            slug: 'detailPage',
            text: 'checkbox link',
          }),
          name: 'checkbox-custom',
          required: true,
        },
        {
          blockType: 'radioBlock',
          fieldError: simpleRteConfig('Sie müssen eine Auswahl treffen'),
          fieldWidth: 'full',
          items: [
            {
              label: simpleRteConfig('Französisch'),
              value: 'french',
            },
          ],
          label: sampleRteWithLink({
            documentId: detailPage3.id,
            slug: 'detailPage',
            text: 'radio link',
          }),
          name: 'language-select',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Form submission on SAGW',
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: simpleRteConfig('Submit text error'),
        title: simpleRteConfig('Submit title error'),
      },
      submitSuccess: {
        text: simpleRteConfig('Submit text success'),
        title: simpleRteConfig(`Submit title success ${tenant.toUpperCase()}`),
      },
      subtitle: simpleRteConfig('Subtitle for contact Form'),
      tenant,
      title: simpleRteConfig(`Contact Form ${tenant.toUpperCase()}`),
    },
  });

  // add link to data privacy checkbox
  const dataPrivacyDocs = await payload.find({
    collection: 'i18nGlobals',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const [dataPrivacyContent] = dataPrivacyDocs.docs;

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      ...dataPrivacyContent,
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: sampleRteWithLink({
            documentId: detailPage4.id,
            slug: 'detailPage',
            text: 'privacy link',
          }),
          errorMessage: simpleRteConfig('text'),
        },
      },
    },
    id: dataPrivacyContent.id,
  });

  // add form to detail page
  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'formBlock',
          form,
        },
      ],
    },
    id: detailPage1.id,
  });

  // test detail 2

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`link target changed ${time}`),
      },
    },
    id: detailPage2.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

  // test detail 3

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`link target changed 2 ${time}`),
      },
    },
    id: detailPage3.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

  // test detail 4

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`link target changed 3 ${time}`),
      },
    },
    id: detailPage4.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
