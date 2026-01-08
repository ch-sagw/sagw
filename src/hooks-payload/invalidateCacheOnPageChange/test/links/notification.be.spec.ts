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
import { sampleRteWithLink } from '@/utilities/rteSampleContent';

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
  const detailPage1 = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  const detailPage2 = await generateDetailPage({
    tenant,
    title: `link target ${time}`,
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'notificationBlock',
          text: sampleRteWithLink({
            documentId: detailPage2.id,
            slug: 'detailPage',
            text: 'some link',
          }),
        },
      ],
    },
    id: detailPage1.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig('link target changed'),
      },
    },
    id: detailPage2.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

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
  const detailPage1 = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  const detailPage2 = await generateDetailPage({
    tenant,
    title: `link target ${time}`,
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'notificationBlock',
          text: sampleRteWithLink({
            documentId: detailPage2.id,
            slug: 'detailPage',
            text: 'some link',
          }),
        },
      ],
    },
    id: detailPage1.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig('link target changed'),
      },
    },
    id: detailPage2.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
