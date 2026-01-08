import {
  expect,
  test,
} from '@playwright/test';
import {
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/page-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates on content change (sagw)', {
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
    title: `overview ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: overviewPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on content change in other locale (sagw)', {
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
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    title: `overview ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: overviewPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on content change (non-sagw)', {
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

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: overviewPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates on content change in other locale (non-sagw)', {
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
    locale: 'it',
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: overviewPage.id,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it/${overviewPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
