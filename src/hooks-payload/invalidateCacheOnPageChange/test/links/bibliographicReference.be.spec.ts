import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generatePublicationDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
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
  const detailPage = await generateDetailPage({
    tenant,
    title: `link target ${time}`,
  });

  const publicationDetailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      content: [
        {
          blockType: 'bibliographicReferenceBlock',
          text: sampleRteWithLink({
            documentId: detailPage.id,
            slug: 'detailPage',
            text: 'some link',
          }),
        },
      ],
    },
    id: publicationDetailPage.id,
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
  const detailPage = await generateDetailPage({
    tenant,
    title: `link target ${time}`,
  });

  const publicationDetailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `link source ${time}`,
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      content: [
        {
          blockType: 'bibliographicReferenceBlock',
          text: sampleRteWithLink({
            documentId: detailPage.id,
            slug: 'detailPage',
            text: 'some link',
          }),
        },
      ],
    },
    id: publicationDetailPage.id,
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

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/link-source-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
