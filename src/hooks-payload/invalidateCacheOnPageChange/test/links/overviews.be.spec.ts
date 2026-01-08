import {
  expect,
  test,
} from '@playwright/test';
import {
  generateEventDetailPage,
  generateInstituteDetailPage,
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
  getHomeId,
} from '@/test-helpers/page-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test.describe('Invalidates overview page with projectsOverview', () => {
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
            blockType: 'projectsOverviewBlock',
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
            blockType: 'projectsOverviewBlock',
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
            blockType: 'projectsOverviewBlock',
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
            blockType: 'projectsOverviewBlock',
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
});

test.describe('Invalidates overview page with magazineOverview', () => {
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
            blockType: 'magazineOverviewBlock',
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
            blockType: 'magazineOverviewBlock',
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
            blockType: 'magazineOverviewBlock',
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
            blockType: 'magazineOverviewBlock',
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
});

test.describe('Invalidates overview page with publicationsOverview', () => {
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
            blockType: 'publicationsOverviewBlock',
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('bar'),
            title: simpleRteConfig('publications'),
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
            blockType: 'publicationsOverviewBlock',
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('bar'),
            title: simpleRteConfig('publications'),
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
            blockType: 'publicationsOverviewBlock',
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('bar'),
            title: simpleRteConfig('publications'),
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
            blockType: 'publicationsOverviewBlock',
            filterTitleAllPublications: simpleRteConfig('foo'),
            filterTitleAllTopics: simpleRteConfig('bar'),
            title: simpleRteConfig('publications'),
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
});

test.describe('Invalidates overview page with eventsOverview', () => {
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
            blockType: 'eventsOverviewBlock',
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
            blockType: 'eventsOverviewBlock',
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
            blockType: 'eventsOverviewBlock',
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
            blockType: 'eventsOverviewBlock',
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
});

test.describe('Invalidates overview page with newsOverview', () => {
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
            blockType: 'newsOverviewBlock',
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
            blockType: 'newsOverviewBlock',
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
            blockType: 'newsOverviewBlock',
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
            blockType: 'newsOverviewBlock',
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
});

test.describe('Invalidates overview page with instituesOverview', () => {
  test('if institute page is created', {
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
            blockType: 'institutesOverviewBlock',
            moreInfoButtonText: simpleRteConfig('More'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateInstituteDetailPage({
      tenant,
      title: `news ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if news page is updated', {
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

    const page = await generateInstituteDetailPage({
      tenant,
      title: `news ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'institutesOverviewBlock',
            moreInfoButtonText: simpleRteConfig('More'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'instituteDetailPage',
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
});

test.describe('Invalidates overview page with nationalDictionariesOverview', () => {
  test('if national dictionary page is created', {
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
            blockType: 'nationalDictionariesOverviewBlock',
            moreInfoButtonText: simpleRteConfig('More'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await generateNationalDictionaryDetailPage({
      tenant,
      title: `news ${time}`,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-${time}`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(1);

  });

  test('if news page is updated', {
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

    const page = await generateNationalDictionaryDetailPage({
      tenant,
      title: `news ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        content: [
          {
            blockType: 'nationalDictionariesOverviewBlock',
            moreInfoButtonText: simpleRteConfig('More'),
          },
        ],
      },
      id: overview.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'nationalDictionaryDetailPage',
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
});
