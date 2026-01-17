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
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('detail page', () => {
  test('does not invalidate on overview page props change (image) (sagw)', {
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
      title: `detail ${time}`,
    });

    const image = await payload.create({
      collection: 'images',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        alt: 'sagw image',
        tenant,
      },
      filePath: 'src/seed/test-data/assets/sagw.png',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          image: image.id,
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

  });

  test('does not invalidate on overview page props change (date) (sagw)', {
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
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          date: '2040',
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

  });

  test('invalidates on topic change (sagw)', {
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
      title: `detail ${time}`,
    });

    const publicationTopic = await payload.create({
      collection: 'publicationTopics',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        publicationTopic: simpleRteConfig('Publication Topic'),
        tenant,
      },
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        categorization: {
          topic: publicationTopic.id,
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

  test('invalidates on type change (sagw)', {
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
      title: `detail ${time}`,
    });

    const publicationType = await payload.create({
      collection: 'publicationTypes',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        publicationType: simpleRteConfig('Publication Type'),
        tenant,
      },
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        categorization: {
          type: publicationType.id,
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

    const detailPage = await generatePublicationDetailPage({
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
      collection: 'publicationDetailPage',
      data: {
        categorization: {
          project: project.id,
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

  test('does not invalidate on overview page props change (image) (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    const image = await payload.create({
      collection: 'images',
      data: {
        alt: 'sagw image',
        tenant,
      },
      filePath: 'src/seed/test-data/assets/sagw.png',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          image: image.id,
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

  });

  test('does not invalidate on overview page props change (date) (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          date: '2040',
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

  });

  test('invalidates on topic change (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    const publicationTopic = await payload.create({
      collection: 'publicationTopics',
      data: {
        publicationTopic: simpleRteConfig('Publication Topic'),
        tenant,
      },
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        categorization: {
          topic: publicationTopic.id,
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

  test('invalidates on type change (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    const publicationType = await payload.create({
      collection: 'publicationTypes',
      data: {
        publicationType: simpleRteConfig('Publication Type'),
        tenant,
      },
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        categorization: {
          type: publicationType.id,
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

    const detailPage = await generatePublicationDetailPage({
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
        name: simpleRteConfig('Project 1'),
        tenant,
      },
      locale: 'de',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        categorization: {
          project: project.id,
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
});

test.describe('overview page', () => {
  test('invalidates page with overview block on overview page props change (image) (sagw)', {
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
      title: `detail ${time}`,
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
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('foo'),
            title: simpleRteConfig('foo'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const image = await payload.create({
      collection: 'images',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        alt: 'sagw image',
        tenant,
      },
      filePath: 'src/seed/test-data/assets/sagw.png',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          image: image.id,
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change (date) (sagw)', {
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
      title: `detail ${time}`,
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
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('foo'),
            title: simpleRteConfig('foo'),
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          date: '2040',
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change (image) (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
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
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('foo'),
            title: simpleRteConfig('foo'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const image = await payload.create({
      collection: 'images',
      data: {
        alt: 'sagw image',
        tenant,
      },
      filePath: 'src/seed/test-data/assets/sagw.png',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          image: image.id,
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change (date) (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
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
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('foo'),
            title: simpleRteConfig('foo'),
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          date: '2040',
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (image) (sagw)', {
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
      title: `detail ${time}`,
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
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const image = await payload.create({
      collection: 'images',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        alt: 'sagw image',
        tenant,
      },
      filePath: 'src/seed/test-data/assets/sagw.png',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          image: image.id,
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (date) (sagw)', {
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
      title: `detail ${time}`,
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
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          date: '2040',
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (image) (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
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
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
    });

    const image = await payload.create({
      collection: 'images',
      data: {
        alt: 'sagw image',
        tenant,
      },
      filePath: 'src/seed/test-data/assets/sagw.png',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          image: image.id,
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (date) (non-sagw)', {
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

    const detailPage = await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
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
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        overviewPageProps: {
          date: '2040',
        },
      },
      id: detailPage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});
