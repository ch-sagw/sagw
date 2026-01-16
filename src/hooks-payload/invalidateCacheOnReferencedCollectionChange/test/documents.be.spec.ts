// if an event category changes, we need to:
// 1. find eventDetailPages which use that category and invalidate that page
// 2. find pages with events overview/teasers and invalidate those pages

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

const getDocument = async (tenant: string, project?: string): Promise<string> => {
  const payload = await getPayloadCached();
  const document = await payload.create({
    collection: 'documents',
    data: {
      date: '2025-10-30',
      project,
      tenant,
      title: simpleRteConfig('Document'),
    },
    filePath: 'src/seed/test-data/assets/sagw.pdf',
  });

  return document.id;
};

const getZenodoDocument = async (tenant: string, project?: string): Promise<string> => {
  const payload = await getPayloadCached();
  const zenodoDocument = await payload.create({
    collection: 'zenodoDocuments',
    data: {
      files: [
        {
          format: 'pdf',
          id: 'someid',
          link: 'https://foo.bar',
          size: 0.26,
        },
        {
          format: 'zip',
          id: 'someotherid',
          link: 'https://foo.bar',
          size: 1.54,
        },
      ],
      project,
      publicationDate: '1919-05-01',
      tenant,
      title: 'Sample Zenodo Document',
      zenodoId: '1512691',
    },
  });

  return zenodoDocument.id;
};

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

  const document = await getDocument(tenant);

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

  const document = await getDocument(tenant);

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

  const document = await getZenodoDocument(tenant);

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

  const document = await getZenodoDocument(tenant);

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

  const document = await getDocument(tenant, project.id);

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

  const document = await getDocument(tenant, project.id);

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

  const document = await getZenodoDocument(tenant, project.id);

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

  const document = await getZenodoDocument(tenant, project.id);

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

  const document = await getDocument(tenant);

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

  const document = await getDocument(tenant);

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

  const document = await getZenodoDocument(tenant);

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

  const document = await getZenodoDocument(tenant);

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

  const document = await getDocument(tenant, project.id);

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

  const document = await getDocument(tenant, project.id);

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

  const document = await getZenodoDocument(tenant, project.id);

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

  const document = await getZenodoDocument(tenant, project.id);

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
