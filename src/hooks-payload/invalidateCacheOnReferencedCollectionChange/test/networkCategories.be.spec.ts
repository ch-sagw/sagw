import {
  expect,
  test,
} from '@playwright/test';
import {
  generateImage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test('invalidates overview page with network teasers if category is changed (sagw)', {
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

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
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
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('changed'),
    },
    id: networkCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates overview page with network teasers if category is deleted (sagw)', {
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

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
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
    collection: 'networkCategories',
    id: networkCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates overview page with network teasers if category is changed (non-sagw)', {
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

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
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
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('changed'),
    },
    id: networkCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates overview page with network teasers if category is deleted (non-sagw)', {
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

  const image = await generateImage(tenant);

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig('Network Category'),
      tenant,
    },
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
    collection: 'networkCategories',
    id: networkCategory.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${overview.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
