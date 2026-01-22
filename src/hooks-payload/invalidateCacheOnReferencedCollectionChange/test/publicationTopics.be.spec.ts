import {
  expect,
  test,
} from '@playwright/test';
import {
  generateOverviewPage,
  generatePublicationDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates publication page after renaming publication topic (sagw)', {
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

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('category changed'),
    },
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates publication page after deleting publication topic (sagw)', {
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

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'publicationTopics',
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with publications overview after renaming publication topic (sagw)', {
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
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('all'),
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('category changed'),
    },
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with publications teaser after renaming publication topic (sagw)', {
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
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('category changed'),
    },
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with publications overview after deleting publication topic (sagw)', {
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
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('all'),
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'publicationTopics',
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with publications teaser after deleting publication topic (sagw)', {
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
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'publicationTopics',
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates publication page after renaming publication topic (non-sagw)', {
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

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('category changed'),
    },
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates publication page after deleting publication topic (non-sagw)', {
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

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'publicationTopics',
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with publications overview after renaming publication topic (non-sagw)', {
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
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('all'),
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('category changed'),
    },
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with publications teaser after renaming publication topic (non-sagw)', {
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
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('category changed'),
    },
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with publications overview after deleting publication topic (non-sagw)', {
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
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('all'),
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'publicationTopics',
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with publications teaser after deleting publication topic (non-sagw)', {
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
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overviewPage.id,
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig('Event Category'),
      tenant,
    },
  });

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
    topic: publicationTopic.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'publicationTopics',
    id: publicationTopic.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});
