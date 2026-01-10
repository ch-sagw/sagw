import {
  expect,
  test,
} from '@playwright/test';
import { getHomeId } from '@/test-helpers/collections-generator';
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

  logCapture.captureLogs();

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: home,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

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

  const homeData = await payload.findByID({
    collection: 'homePage',
    id: home,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
      hero: {
        ...homeData.hero,
        animated: true,
        lead: simpleRteConfig('Home Lead'),
        sideTitle: simpleRteConfig('Home Side-Title'),
        title: simpleRteConfig('title changed'),
      },
    },
    id: home,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

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

  logCapture.captureLogs();

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: home,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

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

  const homeData = await payload.findByID({
    collection: 'homePage',
    id: home,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
      hero: {
        ...homeData.hero,
        animated: true,
        lead: simpleRteConfig('Home Lead'),
        sideTitle: simpleRteConfig('Home Side-Title'),
        title: simpleRteConfig('title changed'),
      },
    },
    id: home,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

