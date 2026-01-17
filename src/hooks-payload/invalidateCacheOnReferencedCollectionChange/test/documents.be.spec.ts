import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateDocument,
  generateZenodoDocument,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates page with downloads block (custom) if document is changed (sagw)', {
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

  logCapture.captureLogs();

  await payload.update({
    collection: 'documents',
    data: {
      date: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (custom) if document is deleted (sagw)', {
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

  logCapture.captureLogs();

  await payload.delete({
    collection: 'documents',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (custom) if zenodo-document is changed (sagw)', {
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

  const document = await generateZenodoDocument(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'zenodoDocuments',
              value: document,
            },
          ],
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'zenodoDocuments',
    data: {
      publicationDate: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (custom) if zenodo-document is deleted (sagw)', {
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

  const document = await generateZenodoDocument(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'zenodoDocuments',
              value: document,
            },
          ],
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'zenodoDocuments',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if document is changed (sagw)', {
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

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'documents',
    data: {
      date: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if document is deleted (sagw)', {
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

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'documents',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if zenodo-document is changed (sagw)', {
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

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateZenodoDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'zenodoDocuments',
    data: {
      publicationDate: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if zenodo-document is deleted (sagw)', {
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

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateZenodoDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'zenodoDocuments',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (custom) if document is changed (non-sagw)', {
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

  logCapture.captureLogs();

  await payload.update({
    collection: 'documents',
    data: {
      date: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (custom) if document is deleted (non-sagw)', {
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

  logCapture.captureLogs();

  await payload.delete({
    collection: 'documents',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (custom) if zenodo-document is changed (non-sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const document = await generateZenodoDocument(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'zenodoDocuments',
              value: document,
            },
          ],
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'zenodoDocuments',
    data: {
      publicationDate: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (custom) if zenodo-document is deleted (non-sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const document = await generateZenodoDocument(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'zenodoDocuments',
              value: document,
            },
          ],
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'zenodoDocuments',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if document is changed (non-sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'documents',
    data: {
      date: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if document is deleted (non-sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'documents',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if zenodo-document is changed (non-sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateZenodoDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'zenodoDocuments',
    data: {
      publicationDate: '2022-02-22',
    },
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with downloads block (auto) if zenodo-document is deleted (non-sagw)', {
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

  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project'),
      tenant,
    },
    locale: 'de',
  });

  const document = await generateZenodoDocument(tenant, project.id);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: project.id,
          subtitle: simpleRteConfig('subtitle'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'zenodoDocuments',
    id: document,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
