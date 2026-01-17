import {
  expect,
  test,
} from '@playwright/test';
import {
  generateNewsDetailPage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test.describe('detail page', () => {
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

  test('does not invalidate on overview page props change (sagw)', {
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
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

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

  test('does not invalidate on overview page props change in other locale (sagw)', {
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
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

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

  test('does not invalidate on overview page props change (non-sagw)', {
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
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

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

  test('does not invalidate on overview page props change in other locale (non-sagw)', {
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
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

  });
});

test.describe('overview page', () => {
  test('invalidates page with overview block on overview page props change (sagw)', {
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
            title: simpleRteConfig('All News'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change in other locale (sagw)', {
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

    const overviewPage = await generateOverviewPage({
      locale: 'it',
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
            title: simpleRteConfig('All News'),
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change (non-sagw)', {
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
            title: simpleRteConfig('All News'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change in other locale (non-sagw)', {
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

    const overviewPage = await generateOverviewPage({
      locale: 'it',
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
            title: simpleRteConfig('All News'),
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (sagw)', {
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
            colorMode: 'light',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change in other locale (sagw)', {
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

    const overviewPage = await generateOverviewPage({
      locale: 'it',
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
            colorMode: 'light',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (non-sagw)', {
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
            colorMode: 'light',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change in other locale (non-sagw)', {
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

    const overviewPage = await generateOverviewPage({
      locale: 'it',
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
            colorMode: 'light',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});
