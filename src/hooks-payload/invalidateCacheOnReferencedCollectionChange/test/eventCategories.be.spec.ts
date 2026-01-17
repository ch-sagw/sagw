import {
  expect,
  test,
} from '@playwright/test';
import {
  generateEventDetailPage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates event page after renaming category (sagw)', {
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

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('category changed'),
    },
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates event page after deleting category (sagw)', {
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

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'eventCategory',
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with eventsOverview after renaming category (sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
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
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('category changed'),
    },
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with eventsTeaser after renaming category (sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'eventsTeasersBlock',
          title: simpleRteConfig('All Events'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('category changed'),
    },
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with eventsOverview after deleting category (sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
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
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  console.log('before');

  logCapture.captureLogs();

  await payload.delete({
    collection: 'eventCategory',
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with eventsTeaser after deleting category (sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'eventsTeasersBlock',
          title: simpleRteConfig('All Events'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'eventCategory',
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates event page after renaming category (non-sagw)', {
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

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('category changed'),
    },
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates event page after deleting category (non-sagw)', {
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

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'eventCategory',
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with eventsOverview after renaming category (non-sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
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
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('category changed'),
    },
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with eventsTeaser after renaming category (non-sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'eventsTeasersBlock',
          title: simpleRteConfig('All Events'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('category changed'),
    },
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with eventsOverview after deleting category (non-sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
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
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  console.log('before');

  logCapture.captureLogs();

  await payload.delete({
    collection: 'eventCategory',
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with eventsTeaser after deleting category (non-sagw)', {
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

  const overviewPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'eventsTeasersBlock',
          title: simpleRteConfig('All Events'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generateEventDetailPage({
    category: eventCategory.id,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `event ${time}`,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'eventCategory',
    id: eventCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});
