// Invalidate all pages (of tenant) on content change

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateEventDetailPage,
  generateMagazineDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { Config } from '@/payload-types';

const generateSamplePages = async ({
  tenant,
  home,
  time,
  locale,
}: {
  tenant: string,
  home: string,
  time: number,
  locale?: Config['locale'],
}): Promise<string> => {
  const overview = await generateOverviewPage({
    locale,
    navigationTitle: `overview ${time}`,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  const detail = await generateDetailPage({
    locale,
    navigationTitle: `detail ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const event = await generateEventDetailPage({
    locale,
    navigationTitle: `event ${time}`,
    parentPage: {
      documentId: detail.id,
      slug: 'detailPage',
    },
    tenant,
    title: `event ${time}`,
  });

  const news = await generateNewsDetailPage({
    locale,
    navigationTitle: `news ${time}`,
    parentPage: {
      documentId: event.id,
      slug: 'eventDetailPage',
    },
    tenant,
    title: `news ${time}`,
  });

  await generateMagazineDetailPage({
    locale,
    navigationTitle: `magazine ${time}`,
    parentPage: {
      documentId: news.id,
      slug: 'newsDetailPage',
    },
    tenant,
    title: `magazine ${time}`,
  });

  return overview.id;
};

// child pages of a page with a changed slug will have a completely new url,
// so we don't expect any invalidations
test('does not invalidate pages along the breadcrumb cascade if slug changes (sagw)', {
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

  const overview = await generateSamplePages({
    home,
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      slug: `overview-${time}-changed`,
    },
    id: overview,
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

// child pages of a page with a changed parent page will have a completely
// new url, so we don't expect any invalidations
test('does not invalidate pages along the breadcrumb cascade if parent page changes (sagw)', {
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

  const overview = await generateSamplePages({
    home,
    tenant,
    time,
  });

  const overview2 = await generateOverviewPage({
    navigationTitle: `overview 2 ${time}`,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview 2 ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      parentPage: {
        documentId: overview2.id,
        slug: 'overviewPage',
      },
    },
    id: overview,
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('invalidates all pages along the breadcrumb cascade if navigation title changes (sagw)', {
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

  const overview = await generateSamplePages({
    home,
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      navigationTitle: `overview ${time} changed`,
    },
    id: overview,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}/detail-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}/detail-${time}/event-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}/detail-${time}/event-${time}/news-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}/detail-${time}/event-${time}/news-${time}/magazine-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

test('does not invalidate pages along the breadcrumb cascade if slug changes in other locale (sagw)', {
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

  const overview = await generateSamplePages({
    home,
    locale: 'it',
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      slug: `overview-${time}-changed`,
    },
    id: overview,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('does not invalidate pages along the breadcrumb cascade if parent page changes in other locale (sagw)', {
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

  const overview = await generateSamplePages({
    home,
    locale: 'it',
    tenant,
    time,
  });

  const overview2 = await generateOverviewPage({
    locale: 'it',
    navigationTitle: `overview 2 ${time}`,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview 2 ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      parentPage: {
        documentId: overview2.id,
        slug: 'overviewPage',
      },
    },
    id: overview,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('invalidates all pages along the breadcrumb cascade if navigation title changes in other locale (sagw)', {
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

  const overview = await generateSamplePages({
    home,
    locale: 'it',
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      navigationTitle: `overview ${time} changed`,
    },
    id: overview,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-${time}/detail-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-${time}/detail-${time}/event-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-${time}/detail-${time}/event-${time}/news-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-${time}/detail-${time}/event-${time}/news-${time}/magazine-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

test('does not invalidate pages along the breadcrumb cascade if slug changes (non-sagw)', {
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

  const overview = await generateSamplePages({
    home,
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      slug: `overview-${time}-changed`,
    },
    id: overview,
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('does not invalidate pages along the breadcrumb cascade if parent page changes (non-sagw)', {
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

  const overview = await generateSamplePages({
    home,
    tenant,
    time,
  });

  const overview2 = await generateOverviewPage({
    navigationTitle: `overview 2 ${time}`,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview 2 ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      parentPage: {
        documentId: overview2.id,
        slug: 'overviewPage',
      },
    },
    id: overview,
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('invalidates all pages along the breadcrumb cascade if navigation title changes (non-sagw)', {
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

  const overview = await generateSamplePages({
    home,
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      navigationTitle: `overview ${time} changed`,
    },
    id: overview,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}/detail-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}/detail-${time}/event-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}/detail-${time}/event-${time}/news-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}/detail-${time}/event-${time}/news-${time}/magazine-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

test('does not invalidate pages along the breadcrumb cascade if slug changes in other locale (non-sagw)', {
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

  const overview = await generateSamplePages({
    home,
    locale: 'it',
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      slug: `overview-${time}-changed`,
    },
    id: overview,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('does not invalidate pages along the breadcrumb cascade if parent page changes in other locale (non-sagw)', {
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

  const overview = await generateSamplePages({
    home,
    locale: 'it',
    tenant,
    time,
  });

  const overview2 = await generateOverviewPage({
    locale: 'it',
    navigationTitle: `overview 2 ${time}`,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview 2 ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      parentPage: {
        documentId: overview2.id,
        slug: 'overviewPage',
      },
    },
    id: overview,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.logs)
    .toHaveLength(0);

});

test('invalidates all pages along the breadcrumb cascade if navigation title changes in other locale (non-sagw)', {
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

  const overview = await generateSamplePages({
    home,
    locale: 'it',
    tenant,
    time,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      navigationTitle: `overview ${time} changed`,
    },
    id: overview,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/overview-${time}/detail-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/overview-${time}/detail-${time}/event-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/overview-${time}/detail-${time}/event-${time}/news-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/overview-${time}/detail-${time}/event-${time}/news-${time}/magazine-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});
