import {
  expect,
  test,
} from '@playwright/test';
import {
  generateProjectDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test('invalidates on overview page props change (teaser text) (sagw)', {
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

  const detailPage = await generateProjectDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'projectDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('teaser text changed'),
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

test('invalidates on overview page props change (link text) (sagw)', {
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

  const detailPage = await generateProjectDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'projectDetailPage',
    data: {
      overviewPageProps: {
        linkText: simpleRteConfig('link text changed'),
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

  const detailPage = await generateProjectDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  const project = await payload.create({
    collection: 'projects',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Project 1'),
      tenant,
    },
    locale: 'de',
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'projectDetailPage',
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

test('invalidates on overview page props change (teaser text) (non-sagw)', {
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

  const detailPage = await generateProjectDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'projectDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('teaser text changed'),
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

test('invalidates on overview page props change (link text) (non-sagw)', {
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

  const detailPage = await generateProjectDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'projectDetailPage',
    data: {
      overviewPageProps: {
        linkText: simpleRteConfig('link text changed'),
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

  const detailPage = await generateProjectDetailPage({
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
      name: simpleRteConfig('Project 1'),
      tenant,
    },
    locale: 'de',
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'projectDetailPage',
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
