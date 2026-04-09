import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateEventDetailPage,
  generateHomePage,
  generateNewsDetailPage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import {
  generateTenant, getTenantId,
} from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  deleteOtherCollections, deleteSetsPages,
  deleteSingletonPages,
} from '@/seed/test-data/deleteData';

const generatePages = async ({
  amountPerPage,
  tenant,
  home,
}: {
  amountPerPage: number;
  tenant: string;
  home: string;
}): Promise<void> => {
  const indices = Array.from({
    length: amountPerPage,
  }, (_, idx) => idx + 1);

  /* eslint-disable no-await-in-loop */

  for (const i of indices) {
    await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${i}`,
    });

    await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${i}`,
    });

    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event ${i}`,
    });

    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `news ${i}`,
    });
  }

  /* eslint-enable no-await-in-loop */
};

test('invalidates all tenant pages on content change (sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const tenantNonSagw = await getTenantId({
    isSagw: false,
    time,
  });

  const home = await getHomeId({
    isSagw: true,
    tenant,
  });

  const homeNonSagw = await getHomeId({
    isSagw: false,
    tenant: tenantNonSagw,
  });

  // generate sagw pages
  await generatePages({
    amountPerPage: 3,
    home,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 2,
    home: homeNonSagw,
    tenant: tenantNonSagw,
  });

  // generate random detail page
  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // the random detail page in 4 languages: 4
  // impressum and privacy pages in 4 languages: 8
  // home in 4 languages: 4
  // /${locale} route in 4 languages: 4

  const langs = [
    'de',
    'fr',
    'it',
    'en',
  ];

  langs.forEach((lang) => {
    for (let i = 0; i < 3; i++) {

      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/detail-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/overview-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/event-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/news-${i + 1}`))
        .toBe(true);
    }

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/detail-${time}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/home`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/impressum-${lang}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/data-privacy-${lang}`))
      .toBe(true);
  });

  expect(logCapture.logs)
    .toHaveLength(68);

});

test('invalidates all tenant pages on content change (non-sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();

  const logCapture = new LogCapture();
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const tenantNonSagw = await generateTenant({
    name: `tenant-${time}`,
  });

  const home = await getHomeId({
    isSagw: true,
    tenant,
  });

  const homeNonSagw = await generateHomePage({
    locale: 'de',
    sideTitle: 'Side',
    tenant: tenantNonSagw.id,
    title: 'Home',
  });

  // generate sagw pages
  await generatePages({
    amountPerPage: 2,
    home,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 3,
    home: homeNonSagw.id,
    tenant: tenantNonSagw.id,
  });

  // generate random detail page
  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: homeNonSagw.id,
      slug: 'homePage',
    },
    tenant: tenantNonSagw.id,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some text'),
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // the random detail page in 4 languages: 4
  // impressum and privacy pages in 4 languages: 8
  // home in 4 languages: 4
  // /${locale} route in 4 languages: 4

  const langs = [
    'de',
    'fr',
    'it',
    'en',
  ];

  langs.forEach((lang) => {
    const tenantAppendix = lang === 'de'
      ? ''
      : `-${lang}`;

    for (let i = 0; i < 3; i++) {

      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/detail-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/overview-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/event-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/news-${i + 1}`))
        .toBe(true);
    }

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/detail-${time}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/home`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/impressum-${lang}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}${tenantAppendix}/data-privacy-${lang}`))
      .toBe(true);
  });

  expect(logCapture.logs)
    .toHaveLength(68);

});
