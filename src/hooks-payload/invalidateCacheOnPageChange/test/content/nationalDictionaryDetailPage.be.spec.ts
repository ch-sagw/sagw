import {
  expect,
  test,
} from '@playwright/test';
import {
  generateNationalDictionaryDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test('invalidates on overview page props change (image) (sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
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
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        image: image.id,
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

test('invalidates on overview page props change (teaser text) (sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('teaser text changed'),
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

test('invalidates on overview page props change (image) (non-sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
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
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        image: image.id,
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

test('invalidates on overview page props change (teaser text) (non-sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        teaserText: simpleRteConfig('teaser text changed'),
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

