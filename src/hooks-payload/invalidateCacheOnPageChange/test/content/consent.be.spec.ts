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

test('invalidates all pages of current tenant (only!) on content change (sagw)', {
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

  // get consent
  const consent = await payload.find({
    collection: 'consent',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'consent',
    data: {
      ...consent.docs[0],
      banner: {
        ...consent.docs[0].banner,
        buttonAcceptAll: simpleRteConfig('Alle zulassen changed'),
      },
      tenant,
    },
    id: consent.docs[0].id,
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

test('invalidates all pages of current tenant (only!) on content change (non-sagw)', {
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

  // get consent
  const consent = await payload.find({
    collection: 'consent',
    where: {
      tenant: {
        equals: tenantNonSagw,
      },
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'consent',
    data: {
      ...consent.docs[0],
      banner: {
        ...consent.docs[0].banner,
        buttonAcceptAll: simpleRteConfig('Alle zulassen changed'),
      },
      tenant: tenantNonSagw,
    },
    id: consent.docs[0].id,
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
