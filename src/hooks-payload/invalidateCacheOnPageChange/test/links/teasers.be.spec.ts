import {
  expect,
  test,
} from '@playwright/test';
import {
  generateEventDetailPage,
  generateMagazineDetailPage,
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

test.describe('Invalidates overview page with eventTeasers', () => {
  test('if event page is created (sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('Events'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateEventDetailPage({
      tenant,
      title: `event ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if event page is updated (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateEventDetailPage({
      tenant,
      title: `event ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'eventDetailPage',
      data: {
        eventDetails: {
          title: simpleRteConfig(`event changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if event page is deleted (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateEventDetailPage({
      tenant,
      title: `event ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'eventDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if event page is created (non-sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('Events'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateEventDetailPage({
      tenant,
      title: `event ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if event page is updated (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateEventDetailPage({
      tenant,
      title: `event ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'eventDetailPage',
      data: {
        eventDetails: {
          title: simpleRteConfig(`event changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if event page is deleted (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateEventDetailPage({
      tenant,
      title: `event ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'eventDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('Invalidates overview page with projectTeasers', () => {
  test('if project page is created (sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('Projects'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateProjectDetailPage({
      tenant,
      title: `project ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if project page is updated (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateProjectDetailPage({
      tenant,
      title: `project ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('Projects'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projectDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`project changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if project page is deleted (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateProjectDetailPage({
      tenant,
      title: `project ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('Projects'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projectDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if project page is created (non-sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('Projects'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateProjectDetailPage({
      tenant,
      title: `project ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if project page is updated (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateProjectDetailPage({
      tenant,
      title: `project ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('Projects'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'projectDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`project changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if project page is deleted (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateProjectDetailPage({
      tenant,
      title: `project ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'projectsTeasersBlock',
            title: simpleRteConfig('Projects'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'projectDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('Invalidates overview page with magazineTeasers', () => {
  test('if magazine page is created (sagw)', {
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
    const overview = await generateOverviewPage({
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
            blockType: 'magazineTeasersBlock',
            title: simpleRteConfig('Magazine'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateMagazineDetailPage({
      tenant,
      title: `magazine ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if magazine page is updated (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateMagazineDetailPage({
      tenant,
      title: `magazine ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'magazineTeasersBlock',
            title: simpleRteConfig('Magazine'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`magazine changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if magazine page is deleted (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateMagazineDetailPage({
      tenant,
      title: `magazine ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'magazineTeasersBlock',
            title: simpleRteConfig('Magazine'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'magazineDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if magazine page is created (non-sagw)', {
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
    const overview = await generateOverviewPage({
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
            blockType: 'magazineTeasersBlock',
            title: simpleRteConfig('Magazine'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateMagazineDetailPage({
      tenant,
      title: `magazine ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if magazine page is updated (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateMagazineDetailPage({
      tenant,
      title: `magazine ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'magazineTeasersBlock',
            title: simpleRteConfig('Magazine'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`magazine changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if magazine page is deleted (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateMagazineDetailPage({
      tenant,
      title: `magazine ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'magazineTeasersBlock',
            title: simpleRteConfig('Magazine'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'magazineDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('Invalidates overview page with newsTeasers', () => {
  test('if news page is created (sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateNewsDetailPage({
      tenant,
      title: `news ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if news page is updated (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateNewsDetailPage({
      tenant,
      title: `news ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'newsDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`news changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if news page is deleted (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateNewsDetailPage({
      tenant,
      title: `news ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'newsDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if news page is created (non-sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateNewsDetailPage({
      tenant,
      title: `news ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if news page is updated (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateNewsDetailPage({
      tenant,
      title: `news ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'newsDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`news changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if news page is deleted (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generateNewsDetailPage({
      tenant,
      title: `news ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'newsTeasersBlock',
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'newsDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});

test.describe('Invalidates overview page with publicationsTeasers', () => {
  test('if publication page is created (sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('Publications'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generatePublicationDetailPage({
      tenant,
      title: `publication ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if publication page is updated (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generatePublicationDetailPage({
      tenant,
      title: `publication ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('Publications'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`publication changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if publication page is deleted (sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generatePublicationDetailPage({
      tenant,
      title: `publication ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('Publications'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'publicationDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if publication page is created (non-sagw)', {
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
    const overview = await generateOverviewPage({
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
            title: simpleRteConfig('Publications'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generatePublicationDetailPage({
      tenant,
      title: `publication ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if publication page is updated (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generatePublicationDetailPage({
      tenant,
      title: `publication ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('Publications'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'publicationDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`publication changed ${time}`),
        },
      },
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if publication page is deleted (non-sagw)', {
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
    const overview = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const page = await generatePublicationDetailPage({
      tenant,
      title: `publication ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('Publications'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.delete({
      collection: 'publicationDetailPage',
      id: page.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });
});
