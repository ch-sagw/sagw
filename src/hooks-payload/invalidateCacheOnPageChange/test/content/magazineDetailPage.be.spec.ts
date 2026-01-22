import {
  expect,
  test,
} from '@playwright/test';
import {
  generateMagazineDetailPage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test.describe('detail page', () => {
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

    const detailPage = await generateMagazineDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

  test('invalidates on author change (sagw)', {
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

    const detailPage = await generateMagazineDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        hero: {
          author: simpleRteConfig('author changed'),
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

    const detailPage = await generateMagazineDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
      locale: 'it',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

  test('invalidates on author change in other locale (sagw)', {
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

    const detailPage = await generateMagazineDetailPage({
      locale: 'it',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        ...detailPage,
        hero: {
          ...detailPage.hero,
          author: simpleRteConfig('author changed'),
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

    const detailPage = await generateMagazineDetailPage({
      locale: 'it',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        ...detailPage,
        hero: {
          ...detailPage.hero,
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

    const detailPage = await generateMagazineDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

  test('invalidates on author change (non-sagw)', {
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

    const detailPage = await generateMagazineDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        hero: {
          author: simpleRteConfig('author changed'),
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

    const detailPage = await generateMagazineDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
      collection: 'magazineDetailPage',
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

  test('invalidates on author change in other locale (non-sagw)', {
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

    const detailPage = await generateMagazineDetailPage({
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
      collection: 'magazineDetailPage',
      data: {
        ...detailPage,
        hero: {
          ...detailPage.hero,
          author: simpleRteConfig('author changed'),
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

    const detailPage = await generateMagazineDetailPage({
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
      collection: 'magazineDetailPage',
      data: {
        ...detailPage,
        hero: {
          ...detailPage.hero,
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

    const detailPage = await generateMagazineDetailPage({
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
            blockType: 'magazineOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
            blockType: 'magazineOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
            blockType: 'magazineOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
            blockType: 'magazineOverviewBlock',
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
            alignment: 'horizontal',
            blockType: 'magazineTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Magazine Teaser'),
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
            alignment: 'horizontal',
            blockType: 'magazineTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Magazine Teaser'),
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
            alignment: 'horizontal',
            blockType: 'magazineTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Magazine Teaser'),
          },
        ],
      },
      id: overviewPage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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

    const detailPage = await generateMagazineDetailPage({
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
            alignment: 'horizontal',
            blockType: 'magazineTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Magazine Teaser'),
          },
        ],
      },
      id: overviewPage.id,
      locale: 'it',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'magazineDetailPage',
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
