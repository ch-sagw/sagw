import {
  expect,
  test,
} from '@playwright/test';
import { getHomeId } from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';

test('invalidates on content change (sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();

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

  // empty home
  await payload.update({
    collection: 'homePage',
    data: {
      content: [],
      hero: {
        animated: true,
        lead: simpleRteConfig('lead'),
        optionalLink: {},
        title: simpleRteConfig('title'),
      },
    },
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

test('invalidates on hero change (sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();

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

  // empty home
  await payload.update({
    collection: 'homePage',
    data: {
      content: [],
      hero: {
        animated: true,
        lead: simpleRteConfig('lead'),
        optionalLink: {},
        title: simpleRteConfig('title'),
      },
    },
    id: home,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'homePage',
    data: {
      hero: {
        title: simpleRteConfig('title changed'),
      },
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
  await deleteOtherCollections();

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

  await payload.update({
    collection: 'homePage',
    data: {
      content: [],
    },
    id: home,
  });

  const homeData = await payload.findByID({
    collection: 'homePage',
    id: home,
  });

  await payload.update({
    collection: 'homePage',
    data: {
      content: [],
      hero: {
        ...homeData.hero,
        optionalLink: undefined,
      },
    },
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

test('invalidates on hero change in other locale (sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();

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

  // empty home
  await payload.update({
    collection: 'homePage',
    data: {
      content: [],
      hero: {
        animated: true,
        lead: simpleRteConfig('lead'),
        optionalLink: {
          link: {
            linkText: simpleRteConfig('some link'),
          },
        },
        title: simpleRteConfig('title'),
      },
    },
    id: home,
    locale: 'it',
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'homePage',
    data: {
      hero: {
        animated: true,
        lead: simpleRteConfig('lead'),
        optionalLink: {
          ...homeData.hero.optionalLink,
          link: {
            linkText: simpleRteConfig('some link'),
          },
        },
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

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

test('invalidates on hero change (non-sagw)', {
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
      hero: {
        title: simpleRteConfig('title changed'),
      },
    },
    id: home,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

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

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

test('invalidates on hero change in other locale (non-sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();

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

  // empty home
  await payload.update({
    collection: 'homePage',
    data: {
      content: [],
      hero: {
        animated: true,
        lead: simpleRteConfig('lead'),
        optionalLink: {
          link: {
            linkText: simpleRteConfig('some link'),
          },
        },
        sideTitle: simpleRteConfig('side'),
        title: simpleRteConfig('title'),
      },
    },
    id: home,
    locale: 'it',
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'homePage',
    data: {
      hero: {
        animated: true,
        lead: simpleRteConfig('lead'),
        optionalLink: {
          ...homeData.hero.optionalLink,
          link: {
            linkText: simpleRteConfig('some link'),
          },
        },
        sideTitle: simpleRteConfig('side'),
        title: simpleRteConfig('title changed'),
      },
    },
    id: home,
    locale: 'it',
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});
