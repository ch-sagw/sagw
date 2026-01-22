import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateImage,
  generateVideo,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates page if video is updated (sagw)', {
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
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const video = await generateVideo(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        /* eslint-disable quote-props */
        {
          blockType: 'videoBlock',
          credits: simpleRteConfig('foo'),
          stillImage: image,
          'video-de': video,
          'video-en': video,
          'video-fr': video,
          'video-it': video,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'videos',
    data: {
      title: 'changed',
    },
    id: video,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page if video is deleted (sagw)', {
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
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const video = await generateVideo(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        /* eslint-disable quote-props */
        {
          blockType: 'videoBlock',
          credits: simpleRteConfig('foo'),
          stillImage: image,
          'video-de': video,
          'video-en': video,
          'video-fr': video,
          'video-it': video,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'videos',
    id: video,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page if video is updated (non-sagw)', {
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
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const video = await generateVideo(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        /* eslint-disable quote-props */
        {
          blockType: 'videoBlock',
          credits: simpleRteConfig('foo'),
          stillImage: image,
          'video-de': video,
          'video-en': video,
          'video-fr': video,
          'video-it': video,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'videos',
    data: {
      title: 'changed',
    },
    id: video,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page if video is deleted (non-sagw)', {
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
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const video = await generateVideo(tenant);

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        /* eslint-disable quote-props */
        {
          blockType: 'videoBlock',
          credits: simpleRteConfig('foo'),
          stillImage: image,
          'video-de': video,
          'video-en': video,
          'video-fr': video,
          'video-it': video,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'videos',
    id: video,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

