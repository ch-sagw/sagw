import {
  expect,
  test,
} from '@playwright/test';
import {
  generateNewsDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates on project change (sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig('category'),
      tenant,
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      project: project.id,
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on date change (sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      hero: {
        date: '2030',
      },
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on overview page props change (sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('overview page props changed'),
      },
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on project change in other locale (sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig('category'),
      tenant,
    },
    locale: 'it',
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      project: project.id,
    },
    id: detailPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on date change in other locale (sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      hero: {
        date: '2030',
      },
    },
    id: detailPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on overview page props change in other locale (sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('overview page props changed'),
      },
    },
    id: detailPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on project change (non-sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig('category'),
      tenant,
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      project: project.id,
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on date change (non-sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      hero: {
        date: '2030',
      },
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on overview page props change (non-sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('overview page props changed'),
      },
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on project change in other locale (non-sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig('category'),
      tenant,
    },
    locale: 'it',
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      project: project.id,
    },
    id: detailPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on date change in other locale (non-sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      hero: {
        date: '2030',
      },
    },
    id: detailPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on overview page props change in other locale (non-sagw)', {
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

  const detailPage = await generateNewsDetailPage({
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('overview page props changed'),
      },
    },
    id: detailPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
