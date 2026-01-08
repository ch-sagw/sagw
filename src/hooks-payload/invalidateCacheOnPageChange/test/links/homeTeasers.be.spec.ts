import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  getHomeId,
} from '@/test-helpers/page-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates if target link changes slug (sagw)', {
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
  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'homeTeasersBlock',
          homeTeasers: [
            {
              category: 'Förderung',
              iconName: 'bar',
              link: {
                internalLink: {
                  documentId: detailPage.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('Zur Förderung'),
              },
              text: simpleRteConfig('text.'),
              title: simpleRteConfig('title.'),
            },
          ],
        },
      ],
    },
    id: home,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig('link target changed'),
      },
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});

test('invalidates if target link changes slug (non-sagw)', {
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
  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'homeTeasersBlock',
          homeTeasers: [
            {
              category: 'Förderung',
              iconName: 'bar',
              link: {
                internalLink: {
                  documentId: detailPage.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('Zur Förderung'),
              },
              text: simpleRteConfig('text.'),
              title: simpleRteConfig('title.'),
            },
          ],
        },
      ],
    },
    id: home,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig('link target changed'),
      },
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});
