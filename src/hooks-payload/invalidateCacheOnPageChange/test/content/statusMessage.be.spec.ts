// Invalidate all pages (of tenant) on content change

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateAllPageTypes,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { allPageInvalidationLogs } from './allPageInvalidationLogs';

test('invalidates all pages of current tenant (only!) on content change (sagw) (homeOnly unchecked)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  // sagw content
  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const home = await getHomeId({
    isSagw: true,
    tenant,
  });

  await generateAllPageTypes({
    home,
    iterator: 1,
    tenant,
    time,
  });

  // non-sagw content
  const tenantNonSagw = await getTenantId({
    isSagw: false,
    time,
  });

  const homeNonSagw = await getHomeId({
    isSagw: false,
    tenant: tenantNonSagw,
  });

  await generateAllPageTypes({
    home: homeNonSagw,
    iterator: 2,
    tenant: tenantNonSagw,
    time,
  });

  // get statusMessage
  const statusMessage = await payload.find({
    collection: 'statusMessage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'statusMessage',
    data: {
      ...statusMessage.docs[0],
      content: {
        ...statusMessage.docs[0].content,
        message: simpleRteConfig('Eigentlich undenkbar, aber trotzdem passiert. Bitte entschuldigen Sie die Unannehmlichkeiten und versuchen Sie es später erneut changed'),
        showOnHomeOnly: false,
      },
    },
    id: statusMessage.docs[0].id,
  });

  logCapture.detachLogs();

  allPageInvalidationLogs({
    isSagw: true,
    time,
  })
    .forEach((log) => {
      expect(logCapture.hasLog(log))
        .toBe(true);
    });

  expect(logCapture.logs)
    .toHaveLength(30);

});

test('invalidates all pages of current tenant (only!) on content change (sagw) (homeOnly checked)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  // sagw content
  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const home = await getHomeId({
    isSagw: true,
    tenant,
  });

  await generateAllPageTypes({
    home,
    iterator: 1,
    tenant,
    time,
  });

  // non-sagw content
  const tenantNonSagw = await getTenantId({
    isSagw: false,
    time,
  });

  const homeNonSagw = await getHomeId({
    isSagw: false,
    tenant: tenantNonSagw,
  });

  await generateAllPageTypes({
    home: homeNonSagw,
    iterator: 2,
    tenant: tenantNonSagw,
    time,
  });

  // get statusMessage
  const statusMessage = await payload.find({
    collection: 'statusMessage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'statusMessage',
    data: {
      ...statusMessage.docs[0],
      content: {
        ...statusMessage.docs[0].content,
        message: simpleRteConfig('Eigentlich undenkbar, aber trotzdem passiert. Bitte entschuldigen Sie die Unannehmlichkeiten und versuchen Sie es später erneut changed'),
        showOnHomeOnly: true,
      },
    },
    id: statusMessage.docs[0].id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

test('invalidates all pages of current tenant (only!) on content change (non-sagw) (homeOnly unchecked)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  // sagw content
  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const home = await getHomeId({
    isSagw: true,
    tenant,
  });

  await generateAllPageTypes({
    home,
    iterator: 1,
    tenant,
    time,
  });

  // non-sagw content
  const tenantNonSagw = await getTenantId({
    isSagw: false,
    time,
  });

  const homeNonSagw = await getHomeId({
    isSagw: false,
    tenant: tenantNonSagw,
  });

  await generateAllPageTypes({
    home: homeNonSagw,
    iterator: 2,
    tenant: tenantNonSagw,
    time,
  });

  // create statusMessage
  const statusMessage = await payload.create({
    collection: 'statusMessage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      content: {
        message: simpleRteConfig('message'),
        show: {
          display: 'show',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('title'),
        type: 'warn',
      },
      tenant: tenantNonSagw,
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'statusMessage',
    data: {
      ...statusMessage,
      content: {
        ...statusMessage.content,
        message: simpleRteConfig('changed'),
      },
    },
    id: statusMessage.id,
  });

  logCapture.detachLogs();

  allPageInvalidationLogs({
    isSagw: false,
    time,
  })
    .forEach((log) => {
      expect(logCapture.hasLog(log))
        .toBe(true);
    });

  expect(logCapture.logs)
    .toHaveLength(31);

});

test('invalidates all pages of current tenant (only!) on content change (non-sagw) (homeOnly checked)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  // sagw content
  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const home = await getHomeId({
    isSagw: true,
    tenant,
  });

  await generateAllPageTypes({
    home,
    iterator: 1,
    tenant,
    time,
  });

  // non-sagw content
  const tenantNonSagw = await getTenantId({
    isSagw: false,
    time,
  });

  const homeNonSagw = await getHomeId({
    isSagw: false,
    tenant: tenantNonSagw,
  });

  await generateAllPageTypes({
    home: homeNonSagw,
    iterator: 2,
    tenant: tenantNonSagw,
    time,
  });

  // create statusMessage
  const statusMessage = await payload.create({
    collection: 'statusMessage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      content: {
        message: simpleRteConfig('message'),
        show: {
          display: 'show',
        },
        showOnHomeOnly: true,
        title: simpleRteConfig('title'),
        type: 'warn',
      },
      tenant: tenantNonSagw,
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'statusMessage',
    data: {
      ...statusMessage,
      content: {
        ...statusMessage.content,
        message: simpleRteConfig('changed'),
      },
    },
    id: statusMessage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}-fr`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}-en`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});
