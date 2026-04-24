import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDataPrivacyPage,
  generateDetailPage,
  generateEventDetailPage,
  generateForm,
  generateHomePage,
  generateImpressumPage,
  generateNewsDetailPage,
  generateOverviewPage,
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

const logCacheInvalidationContext = {
  logCacheInvalidation: true,
} as const;

const generatePages = async ({
  amountPerPage,
  tenant,
}: {
  amountPerPage: number;
  tenant: string;
}): Promise<string> => {
  const indices = Array.from({
    length: amountPerPage,
  }, (_, idx) => idx + 1);

  const home = await generateHomePage({
    locale: 'de',
    sideTitle: 'Side',
    tenant,
    title: 'Home',
  });

  /* eslint-disable no-await-in-loop */

  for (const i of indices) {
    await generateDetailPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${i}`,
    });

    await generateOverviewPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${i}`,
    });

    await generateEventDetailPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `event ${i}`,
    });

    await generateNewsDetailPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `news ${i}`,
    });
  }

  await generateImpressumPage({
    tenant,
  });

  await generateDataPrivacyPage({
    tenant,
  });

  return home.id;

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

  // generate sagw pages
  const home = await generatePages({
    amountPerPage: 3,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 2,
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
    context: logCacheInvalidationContext,
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}`))
      .toBe(true);
  });

  expect(logCapture.hasLog('[CACHE] invalidating path: /de/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /de/datenschutzerklaerung'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/declaration-de-protection-des-donnees'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /it/colophon'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it/informativa-sulla-privacy'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /en/publishing-details'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en/data-privacy'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(64);

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
    slug: `tenant-${time}`,
  });

  // generate sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant,
  });

  // generate non-sagw pages
  const homeNonSagw = await generatePages({
    amountPerPage: 3,
    tenant: tenantNonSagw.id,
  });

  // generate random detail page
  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: homeNonSagw,
      slug: 'homePage',
    },
    tenant: tenantNonSagw.id,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'detailPage',
    context: logCacheInvalidationContext,
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
  // /${locale} route in 4 languages: 4

  const langs = [
    'de',
    'fr',
    'it',
    'en',
  ];

  langs.forEach((lang) => {
    for (let i = 0; i < 3; i++) {

      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/detail-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/overview-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/event-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/news-${i + 1}`))
        .toBe(true);
    }

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/detail-${time}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}`))
      .toBe(true);
  });

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/datenschutzerklaerung`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/declaration-de-protection-des-donnees`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/colophon`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/informativa-sulla-privacy`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/publishing-details`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/data-privacy`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(64);

});

test('invalidates all tenant pages on page deletion (sagw)', {
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

  // generate sagw pages
  const home = await generatePages({
    amountPerPage: 3,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 2,
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

  await payload.delete({
    collection: 'detailPage',
    context: logCacheInvalidationContext,
    id: detailPage.id,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // impressum and privacy pages in 4 languages: 8
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}`))
      .toBe(true);
  });

  expect(logCapture.hasLog('[CACHE] invalidating path: /de/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /de/datenschutzerklaerung'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/declaration-de-protection-des-donnees'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /it/colophon'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it/informativa-sulla-privacy'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /en/publishing-details'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en/data-privacy'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(60);

});

test('invalidates all tenant pages on page deletion (non-sagw)', {
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
    slug: `tenant-${time}`,
  });

  // generate sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant,
  });

  // generate non-sagw pages
  const homeNonSagw = await generatePages({
    amountPerPage: 3,
    tenant: tenantNonSagw.id,
  });

  // generate random detail page
  const detailPage = await generateDetailPage({
    parentPage: {
      documentId: homeNonSagw,
      slug: 'homePage',
    },
    tenant: tenantNonSagw.id,
    title: `detail ${time}`,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'detailPage',
    context: logCacheInvalidationContext,
    id: detailPage.id,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // impressum and privacy pages in 4 languages: 8
  // /${locale} route in 4 languages: 4

  const langs = [
    'de',
    'fr',
    'it',
    'en',
  ];

  langs.forEach((lang) => {
    for (let i = 0; i < 3; i++) {

      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/detail-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/overview-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/event-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/news-${i + 1}`))
        .toBe(true);
    }

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}`))
      .toBe(true);
  });

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/datenschutzerklaerung`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/declaration-de-protection-des-donnees`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/colophon`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/informativa-sulla-privacy`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/publishing-details`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/data-privacy`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(60);

});

test('invalidates all tenant pages on page creation (sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();

  const logCapture = new LogCapture();
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

  // generate sagw pages
  const home = await generatePages({
    amountPerPage: 3,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant: tenantNonSagw,
  });

  logCapture.captureLogs();

  // generate random detail page
  await generateDetailPage({
    context: logCacheInvalidationContext,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // the random detail page in 4 languages: 4
  // impressum and privacy pages in 4 languages: 8
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}`))
      .toBe(true);
  });

  expect(logCapture.hasLog('[CACHE] invalidating path: /de/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /de/datenschutzerklaerung'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/declaration-de-protection-des-donnees'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /it/colophon'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it/informativa-sulla-privacy'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /en/publishing-details'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en/data-privacy'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(64);

});

test('invalidates all tenant pages on page creation (non-sagw)', {
  tag: '@cache',
}, async () => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();

  const logCapture = new LogCapture();
  const time = (new Date())
    .getTime();

  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const tenantNonSagw = await generateTenant({
    slug: `tenant-${time}`,
  });

  // generate sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant,
  });

  // generate non-sagw pages
  const homeNonSagw = await generatePages({
    amountPerPage: 3,
    tenant: tenantNonSagw.id,
  });

  logCapture.captureLogs();

  // generate random detail page
  await generateDetailPage({
    context: logCacheInvalidationContext,
    parentPage: {
      documentId: homeNonSagw,
      slug: 'homePage',
    },
    tenant: tenantNonSagw.id,
    title: `detail ${time}`,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // the random detail page in 4 languages: 4
  // impressum and privacy pages in 4 languages: 8
  // /${locale} route in 4 languages: 4

  const langs = [
    'de',
    'fr',
    'it',
    'en',
  ];

  langs.forEach((lang) => {
    for (let i = 0; i < 3; i++) {

      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/detail-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/overview-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/event-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/news-${i + 1}`))
        .toBe(true);
    }

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/detail-${time}`))
      .toBe(true);

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}`))
      .toBe(true);
  });

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/datenschutzerklaerung`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/declaration-de-protection-des-donnees`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/colophon`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/informativa-sulla-privacy`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/publishing-details`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/data-privacy`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(64);

});

test('invalidates all tenant pages on non-autosave collection change (sagw)', {
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

  // generate sagw pages
  await generatePages({
    amountPerPage: 3,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant: tenantNonSagw,
  });

  // generate form
  const form = await generateForm(tenant);

  logCapture.captureLogs();

  await payload.update({
    collection: 'forms',
    context: logCacheInvalidationContext,
    data: {
      title: simpleRteConfig('some changed title'),
    },
    id: form,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // impressum and privacy pages in 4 languages: 8
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

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}`))
      .toBe(true);
  });

  expect(logCapture.hasLog('[CACHE] invalidating path: /de/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /de/datenschutzerklaerung'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/impressum'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /fr/declaration-de-protection-des-donnees'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /it/colophon'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /it/informativa-sulla-privacy'))
    .toBe(true);

  expect(logCapture.hasLog('[CACHE] invalidating path: /en/publishing-details'))
    .toBe(true);
  expect(logCapture.hasLog('[CACHE] invalidating path: /en/data-privacy'))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(60);

});

test('invalidates all tenant pages on non-autosave collection change (non-sagw)', {
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
    slug: `tenant-${time}`,
  });

  // generate sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 3,
    tenant: tenantNonSagw.id,
  });

  // generate random detail page
  const form = await generateForm(tenantNonSagw.id);

  logCapture.captureLogs();

  await payload.update({
    collection: 'forms',
    context: logCacheInvalidationContext,
    data: {
      title: simpleRteConfig('some title changed'),
    },
    id: form,
  });

  logCapture.detachLogs();

  // we expect:
  // 3 pages for 4 page types in 4 languages: 48
  // impressum and privacy pages in 4 languages: 8
  // /${locale} route in 4 languages: 4

  const langs = [
    'de',
    'fr',
    'it',
    'en',
  ];

  langs.forEach((lang) => {
    for (let i = 0; i < 3; i++) {

      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/detail-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/overview-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/event-${i + 1}`))
        .toBe(true);
      expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}/news-${i + 1}`))
        .toBe(true);
    }

    expect(logCapture.hasLog(`[CACHE] invalidating path: /${lang}/tenant-${time}`))
      .toBe(true);
  });

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/datenschutzerklaerung`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/impressum`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}/declaration-de-protection-des-donnees`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/colophon`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}/informativa-sulla-privacy`))
    .toBe(true);

  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/publishing-details`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}/data-privacy`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(60);

});
