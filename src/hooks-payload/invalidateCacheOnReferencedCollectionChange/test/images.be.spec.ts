import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateImage,
  generateInstituteDetailPage,
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
  generateOverviewPage,
  generatePublicationDetailPage,
  generateVideo,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates page with image block if image is changed (sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with image block if image is deleted (sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates overview page with institute overview if image is changed (sagw)', {
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

  const detailPage = await generateInstituteDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'institutesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with institute overview if image is deleted (sagw)', {
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

  const detailPage = await generateInstituteDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'institutesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with national dictionary overview if image is changed (sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'nationalDictionariesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with national dictionary overview if image is deleted (sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'nationalDictionariesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication overview if image is changed (sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('bar'),
          title: simpleRteConfig('foo'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication overview if image is deleted (sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('bar'),
          title: simpleRteConfig('foo'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication teasers if image is changed (sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication teasers if image is deleted (sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with network teasers if image is changed (sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'networkTeasersBlock',
          filter: {
            allCheckboxText: simpleRteConfig('Alle Fachgesellschaften'),
            title: simpleRteConfig('Fachgesellschaften'),
          },
          items: {
            foundingYearText: simpleRteConfig('Gründungsjahr'),
            items: [
              {
                category: networkCategory.id,
                externalLink: 'https://www.foo.bar',
                foundingYear: 1983,
                image,
                title: simpleRteConfig('Network item'),
              },
            ],
            linkText: simpleRteConfig('Öffnen'),
          },
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with network teasers if image is deleted (sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'networkTeasersBlock',
          filter: {
            allCheckboxText: simpleRteConfig('Alle Fachgesellschaften'),
            title: simpleRteConfig('Fachgesellschaften'),
          },
          items: {
            foundingYearText: simpleRteConfig('Gründungsjahr'),
            items: [
              {
                category: networkCategory.id,
                externalLink: 'https://www.foo.bar',
                foundingYear: 1983,
                image,
                title: simpleRteConfig('Network item'),
              },
            ],
            linkText: simpleRteConfig('Öffnen'),
          },
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with magazine overview if news image is changed (sagw)', {
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

  const detailPage = await generateMagazineDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'magazineDetailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'magazineOverviewBlock',
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with magazine overview if news image is deleted (sagw)', {
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

  const detailPage = await generateMagazineDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'magazineDetailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'magazineOverviewBlock',
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with video if still image is updated (sagw)', {
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
    collection: 'images',
    data: {
      alt: 'changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with video if still image is deleted (sagw)', {
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
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with cta contact if image is changed (sagw)', {
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
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with cta contact if image is deleted (sagw)', {
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
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with people overview if image is changed (sagw)', {
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

  const detailPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  const team = await payload.create({
    collection: 'teams',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Team'),
      people: [person.id],
      tenant,
    },
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'peopleOverviewBlock',
          teams: team.id,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with people overview if image is deleted (sagw)', {
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

  const detailPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  const team = await payload.create({
    collection: 'teams',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Team'),
      people: [person.id],
      tenant,
    },
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'peopleOverviewBlock',
          teams: team.id,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with image in meta if image is changed (sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      meta: {
        seo: {
          image,
        },
      },
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with image in meta if image is deleted (sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      meta: {
        seo: {
          image,
        },
      },
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with image block if image is changed (non-sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with image block if image is deleted (non-sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates overview page with institute overview if image is changed (non-sagw)', {
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

  const detailPage = await generateInstituteDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'institutesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with institute overview if image is deleted (non-sagw)', {
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

  const detailPage = await generateInstituteDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'institutesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with national dictionary overview if image is changed (non-sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'nationalDictionariesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with national dictionary overview if image is deleted (non-sagw)', {
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

  const detailPage = await generateNationalDictionaryDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'nationalDictionariesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('button'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication overview if image is changed (non-sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('bar'),
          title: simpleRteConfig('foo'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication overview if image is deleted (non-sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsOverviewBlock',
          filterTitleAllPublications: simpleRteConfig('all'),
          filterTitleAllTopics: simpleRteConfig('bar'),
          title: simpleRteConfig('foo'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication teasers if image is changed (non-sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with publication teasers if image is deleted (non-sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'publicationsTeasersBlock',
          title: simpleRteConfig('title'),
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with network teasers if image is changed (non-sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'networkTeasersBlock',
          filter: {
            allCheckboxText: simpleRteConfig('Alle Fachgesellschaften'),
            title: simpleRteConfig('Fachgesellschaften'),
          },
          items: {
            foundingYearText: simpleRteConfig('Gründungsjahr'),
            items: [
              {
                category: networkCategory.id,
                externalLink: 'https://www.foo.bar',
                foundingYear: 1983,
                image,
                title: simpleRteConfig('Network item'),
              },
            ],
            linkText: simpleRteConfig('Öffnen'),
          },
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates overview page with network teasers if image is deleted (non-sagw)', {
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

  const detailPage = await generatePublicationDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      overviewPageProps: {
        image,
      },
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'networkTeasersBlock',
          filter: {
            allCheckboxText: simpleRteConfig('Alle Fachgesellschaften'),
            title: simpleRteConfig('Fachgesellschaften'),
          },
          items: {
            foundingYearText: simpleRteConfig('Gründungsjahr'),
            items: [
              {
                category: networkCategory.id,
                externalLink: 'https://www.foo.bar',
                foundingYear: 1983,
                image,
                title: simpleRteConfig('Network item'),
              },
            ],
            linkText: simpleRteConfig('Öffnen'),
          },
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with magazine overview if news image is changed (non-sagw)', {
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

  const detailPage = await generateMagazineDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'magazineDetailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'magazineOverviewBlock',
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with magazine overview if news image is deleted (non-sagw)', {
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

  const detailPage = await generateMagazineDetailPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);

  await payload.update({
    collection: 'magazineDetailPage',
    data: {
      content: [
        {
          alignment: 'center',
          blockType: 'imageBlock',
          credits: simpleRteConfig('some credits'),
          image,
        },
      ],
    },
    id: detailPage.id,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${time}`,
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'magazineOverviewBlock',
        },
      ],
    },
    id: overview.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);
  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(2);

});

test('invalidates page with video if still image is updated (non-sagw)', {
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
    collection: 'images',
    data: {
      alt: 'changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with video if still image is deleted (non-sagw)', {
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
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with cta contact if image is changed (non-sagw)', {
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
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'alt changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with cta contact if image is deleted (non-sagw)', {
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
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      content: [
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with people overview if image is changed (non-sagw)', {
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

  const detailPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  const team = await payload.create({
    collection: 'teams',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Team'),
      people: [person.id],
      tenant,
    },
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'peopleOverviewBlock',
          teams: team.id,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with people overview if image is deleted (non-sagw)', {
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

  const detailPage = await generateOverviewPage({
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `detail ${time}`,
  });

  const image = await generateImage(tenant);
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('Firstname'),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig('Lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  const team = await payload.create({
    collection: 'teams',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      name: simpleRteConfig('Team'),
      people: [person.id],
      tenant,
    },
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      content: [
        {
          blockType: 'peopleOverviewBlock',
          teams: team.id,
        },
      ],
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with image in meta if image is changed (non-sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      meta: {
        seo: {
          image,
        },
      },
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'images',
    data: {
      alt: 'changed',
    },
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with image in meta if image is deleted (non-sagw)', {
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

  await payload.update({
    collection: 'detailPage',
    data: {
      meta: {
        seo: {
          image,
        },
      },
    },
    id: detailPage.id,
  });

  logCapture.captureLogs();

  await payload.delete({
    collection: 'images',
    id: image,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
