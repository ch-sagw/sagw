// if an event category changes, we need to:
// 1. find eventDetailPages which use that category and invalidate that page
// 2. find pages with events overview/teasers and invalidate those pages

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateEventDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test.describe('downloads block', () => {
  test('invalidates page with downloads block (automtic enabled) after renaming project (sagw)', {
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

    const pageWithDownload = await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail download ${time}`,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'downloadsBlock',
            customOrAuto: 'auto',
            project: project.id,
          },
        ],
      },
      id: pageWithDownload.id,
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${pageWithDownload.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('does not invalidate page with downloads block (custom enabled) after renaming project (sagw)', {
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

    const pageWithDownload = await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail download ${time}`,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const document = await payload.create({
      collection: 'documents',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        date: '2025-10-30',
        tenant,
        title: simpleRteConfig('Document'),
      },
      filePath: 'src/seed/test-data/assets/sagw.pdf',
    });

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
                value: document.id,
              },
            ],
          },
        ],
      },
      id: pageWithDownload.id,
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with downloads block (automtic enabled) after renaming project (non-sagw)', {
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

    const pageWithDownload = await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail download ${time}`,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'downloadsBlock',
            customOrAuto: 'auto',
            project: project.id,
          },
        ],
      },
      id: pageWithDownload.id,
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${pageWithDownload.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('does not invalidate page with downloads block (custom enabled) after renaming project (non-sagw)', {
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

    const pageWithDownload = await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail download ${time}`,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const document = await payload.create({
      collection: 'documents',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        date: '2025-10-30',
        tenant,
        title: simpleRteConfig('Document'),
      },
      filePath: 'src/seed/test-data/assets/sagw.pdf',
    });

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
                value: document.id,
              },
            ],
          },
        ],
      },
      id: pageWithDownload.id,
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('publication teasers / overviews', () => {
  test('invalidates page with publications overview after renaming project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with publications teaser after renaming project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with publications overview after deleting project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with publications teaser after deleting project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with publications overview after renaming project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with publications teaser after renaming project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with publications overview after deleting project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with publications teaser after deleting project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });
});

test.describe('project teasers / overviews', () => {
  test('invalidates page with project overview after renaming project (sagw)', {
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
            blockType: 'projectsOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    console.log('before');

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with project teaser after renaming project (sagw)', {
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
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with project overview after deleting project (sagw)', {
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
            blockType: 'projectsOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with project teaser after deleting project (sagw)', {
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
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with project overview after renaming project (non-sagw)', {
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
            blockType: 'projectsOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with project teaser after renaming project (non-sagw)', {
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
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with project overview after deleting project (non-sagw)', {
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
            blockType: 'projectsOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with project teaser after deleting project (non-sagw)', {
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
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });
});

test.describe('news teasers / overviews', () => {
  test('invalidates page with news overview after renaming project (sagw)', {
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
            blockType: 'newsOverviewBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    console.log('before');

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with news teaser after renaming project (sagw)', {
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
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with news overview after deleting project (sagw)', {
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
            blockType: 'newsOverviewBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with news teaser after deleting project (sagw)', {
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
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with news overview after renaming project (non-sagw)', {
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
            blockType: 'newsOverviewBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with news teaser after renaming project (non-sagw)', {
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
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with news overview after deleting project (non-sagw)', {
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
            blockType: 'newsOverviewBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with news teaser after deleting project (non-sagw)', {
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
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });
});

test.describe('events teasers / overviews', () => {
  test('invalidates page with events overview after renaming project (sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    console.log('before');

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with events teaser after renaming project (sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with events overview after deleting project (sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with events teaser after deleting project (sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with events overview after renaming project (non-sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with events teaser after renaming project (non-sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with events overview after deleting project (non-sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });

  test('invalidates page with events teaser after deleting project (non-sagw)', {
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
            title: simpleRteConfig('title'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(2);

  });
});

test.describe('publication page', () => {

  test('invalidates publication page after renaming project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates publication page after deleting project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates publication page after renaming project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates publication page after deleting project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('project page', () => {

  test('invalidates projects page after renaming project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateProjectDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates projects page after deleting project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateProjectDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates projects page after renaming project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateProjectDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates projects page after deleting project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateProjectDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('news page', () => {

  test('invalidates news page after renaming project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates news page after deleting project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates news page after renaming project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates news page after deleting project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('events page', () => {

  test('invalidates events page after renaming project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates events page after deleting project (sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates events page after renaming project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projects',
      data: {
        name: simpleRteConfig('category changed'),
      },
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates events page after deleting project (non-sagw)', {
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig('Event Category'),
        tenant,
      },
    });

    const detailPage = await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projects',
      id: project.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});
