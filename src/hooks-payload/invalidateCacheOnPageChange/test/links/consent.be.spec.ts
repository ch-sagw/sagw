import {
  expect,
  test,
} from '@playwright/test';
import {
  generateAllPageTypes,
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
  const generatedPagesTarget = await generateAllPageTypes({
    home,
    iterator: 1,
    tenant,
    time,
  });

  const consentDocs = await payload.find({
    collection: 'consent',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const [consentData] = consentDocs.docs;

  await payload.update({
    collection: 'consent',
    data: {
      banner: {
        ...consentData.banner,
        text: sampleRteWithLink({
          documentId: generatedPagesTarget.detailPage.id,
          slug: 'detailPage',
          text: 'some link',
        }),
      },
      overlay: {
        ...consentData.overlay,
        analyticsPerformance: {
          text: sampleRteWithLink({
            documentId: generatedPagesTarget.overviewPage.id,
            slug: 'overviewPage',
            text: 'some link',
          }),
        },
        externalContent: {
          text: sampleRteWithLink({
            documentId: generatedPagesTarget.newsDetailPage.id,
            slug: 'newsDetailPage',
            text: 'some link',
          }),
        },
        necessaryCookies: {
          text: sampleRteWithLink({
            documentId: generatedPagesTarget.instituteDetailPage.id,
            slug: 'instituteDetailPage',
            text: 'some link',
          }),
        },
      },
    },
    id: consentData.id,
  });

  // change banner link target
  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`detail changed ${time}`),
      },
    },
    id: generatedPagesTarget.detailPage.id,
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

  // change overlay link target 1
  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      hero: {
        title: simpleRteConfig(`overview changed ${time}`),
      },
    },
    id: generatedPagesTarget.overviewPage.id,
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

  // change overlay link target 2
  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`news changed ${time}`),
      },
    },
    id: generatedPagesTarget.newsDetailPage.id,
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

  // change overlay link target 2
  logCapture.captureLogs();

  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`institute changed ${time}`),
      },
    },
    id: generatedPagesTarget.instituteDetailPage.id,
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
  const generatedPagesTarget = await generateAllPageTypes({
    home,
    iterator: 1,
    tenant,
    time,
  });

  const consentDocs = await payload.find({
    collection: 'consent',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const [consentData] = consentDocs.docs;

  await payload.update({
    collection: 'consent',
    data: {
      banner: {
        ...consentData.banner,
        text: sampleRteWithLink({
          documentId: generatedPagesTarget.detailPage.id,
          slug: 'detailPage',
          text: 'some link',
        }),
      },
      overlay: {
        ...consentData.overlay,
        analyticsPerformance: {
          text: sampleRteWithLink({
            documentId: generatedPagesTarget.overviewPage.id,
            slug: 'overviewPage',
            text: 'some link',
          }),
        },
        externalContent: {
          text: sampleRteWithLink({
            documentId: generatedPagesTarget.newsDetailPage.id,
            slug: 'newsDetailPage',
            text: 'some link',
          }),
        },
        necessaryCookies: {
          text: sampleRteWithLink({
            documentId: generatedPagesTarget.instituteDetailPage.id,
            slug: 'instituteDetailPage',
            text: 'some link',
          }),
        },
      },
    },
    id: consentData.id,
  });

  // change banner link target
  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`detail changed ${time}`),
      },
    },
    id: generatedPagesTarget.detailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

  // change overlay link target 1
  logCapture.captureLogs();

  await payload.update({
    collection: 'overviewPage',
    data: {
      hero: {
        title: simpleRteConfig(`overview changed ${time}`),
      },
    },
    id: generatedPagesTarget.overviewPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

  // change overlay link target 2
  logCapture.captureLogs();

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`news changed ${time}`),
      },
    },
    id: generatedPagesTarget.newsDetailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

  // change overlay link target 2
  logCapture.captureLogs();

  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`institute changed ${time}`),
      },
    },
    id: generatedPagesTarget.instituteDetailPage.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(4);

});
