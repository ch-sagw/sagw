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

  // get header
  const header = await payload.find({
    collection: 'header',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'header',
    data: {
      ...header.docs[0],
      metanavigation: {
        metaLinks: [
          {
            linkExternal: {
              externalLink: 'https://www.foo.bar',
              externalLinkText: simpleRteConfig('some changed metanav item'),
            },
            linkType: 'external',
          },
        ],
      },
    },
    id: header.docs[0].id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /de/data-privacy-de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/data-privacy-fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it/data-privacy-it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en/data-privacy-en'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /de/impressum-de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/impressum-fr'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it/impressum-it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en/impressum-en'))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/magazine-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/magazine-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/news-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/news-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/detail-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/detail-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/national-dictionary-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/national-dictionary-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/publication-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/publication-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/institute-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/institute-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/project-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/project-1-${time}-it`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/overview-1-${time}/event-1-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/overview-1-${time}-it/event-1-${time}-it`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(30);

});

