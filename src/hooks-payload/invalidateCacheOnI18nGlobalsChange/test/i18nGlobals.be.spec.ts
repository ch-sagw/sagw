import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateDocument,
  generateEventDetailPage,
  generateForm,
  generateImage,
  generateMagazineDetailPage,
  generateOverviewPage,
  generatePublicationDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { I18NGlobal } from '@/payload-types';

const getI18n = async (tenant: string): Promise<I18NGlobal> => {
  const payload = await getPayloadCached();
  const i18nData = await payload.find({
    collection: 'i18nGlobals',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  return i18nData.docs[0];
};

test('invalidates page if download title is changed (sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const document = await generateDocument(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'documents',
              value: document,
            },
          ],
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      generic: {
        downloadTitle: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page if links title is changed (sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'linksBlock',
          links: [
            {
              linkExternal: {
                description: simpleRteConfig('foo'),
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('bar'),
              },
              linkType: 'external',
            },
          ],
        },
      ],
    },
    id: detailPage.id,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      generic: {
        linksTitle: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page if writeEmailButtonText is changed (sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },
      ],
    },
    id: detailPage.id,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      generic: {
        writeEmailButtonText: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page if exportArticleButtonText is changed (sagw)', {
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

  const detailPage = await generateMagazineDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      generic: {
        exportArticleButtonText: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates event detail page if time is changed (sagw)', {
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

  const detailPage = await generateEventDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      generic: {
        time: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with event overview if time is changed (sagw)', {
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

  const detailPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'eventsOverviewBlock',
          title: simpleRteConfig('All Events'),
        },
      ],
    },
    id: detailPage.id,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      generic: {
        time: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with event teasers if time is changed (sagw)', {
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

  const detailPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'eventsTeasersBlock',
          title: simpleRteConfig('Events'),
        },
      ],
    },
    id: detailPage.id,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      generic: {
        time: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page if copyButtonText is changed (sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      content: [
        {
          blockType: 'bibliographicReferenceBlock',
          text: simpleRteConfig('foo'),
        },
      ],
    },
    id: detailPage.id,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      bibliographicReference: {
        copyButtonText: simpleRteConfig(`changed ${time}`),
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('does not invalidate page with form (without automatic dataprivacy checkbox) if dataPrivacyCheckboxText is changed (sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const form = await generateForm(tenant);

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
    id: detailPage.id,
  });

  await payload.update({
    collection: 'forms',
    data: {
      showPrivacyCheckbox: false,
    },
    id: form,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig(`changed ${time}`),
        },
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(false);

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('does invalidate page with form (with automatic dataprivacy checkbox) if dataPrivacyCheckboxText is changed (sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const form = await generateForm(tenant);

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
    id: detailPage.id,
  });

  await payload.update({
    collection: 'forms',
    data: {
      showPrivacyCheckbox: true,
    },
    id: form,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig(`changed ${time}`),
        },
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('does not invalidate page with form (without automatic dataprivacy checkbox) if errorMessage is changed (sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const form = await generateForm(tenant);

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
    id: detailPage.id,
  });

  await payload.update({
    collection: 'forms',
    data: {
      showPrivacyCheckbox: false,
    },
    id: form,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      forms: {
        dataPrivacyCheckbox: {
          errorMessage: simpleRteConfig(`changed ${time}`),
        },
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(false);

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('does invalidate page with form (with automatic dataprivacy checkbox) if errorMessage is changed (sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const form = await generateForm(tenant);

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
    id: detailPage.id,
  });

  await payload.update({
    collection: 'forms',
    data: {
      showPrivacyCheckbox: true,
    },
    id: form,
  });

  const i18n = await getI18n(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'i18nGlobals',
    data: {
      forms: {
        dataPrivacyCheckbox: {
          errorMessage: simpleRteConfig(`changed ${time}`),
        },
      },
    },
    id: i18n.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
