import {
  expect,
  test,
} from '@playwright/test';
import {
  generateOverviewPage,
  generateProjectDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('detail page', () => {
  test('does not invalidate on overview page props change (teaser text) (sagw)', {
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
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

  });

  test('does not invalidate on overview page props change (link text) (sagw)', {
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
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

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

  test('does not invalidate on overview page props change (teaser text) (non-sagw)', {
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
      .toBe(false);

    expect(logCapture.logs)
      .toHaveLength(0);

  });

  test('does not invalidate on overview page props change (link text) (non-sagw)', {
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
});

test.describe('overview page', () => {
  test('invalidates page with overview block on overview page props change (teaser text) (sagw)', {
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change (link text) (sagw)', {
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change (teaser text) (non-sagw)', {
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with overview block on overview page props change (link text) (non-sagw)', {
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (teaser text) (sagw)', {
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
            alignment: 'vertical',
            blockType: 'projectsTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (link text) (sagw)', {
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
            alignment: 'vertical',
            blockType: 'projectsTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (teaser text) (non-sagw)', {
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
            alignment: 'vertical',
            blockType: 'projectsTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('invalidates page with teaser block on overview page props change (link text) (non-sagw)', {
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
            alignment: 'vertical',
            blockType: 'projectsTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Project Teaser'),
          },
        ],
      },
      id: overviewPage.id,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

});
