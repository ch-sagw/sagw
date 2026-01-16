// if an event category changes, we need to:
// 1. find eventDetailPages which use that category and invalidate that page
// 2. find pages with events overview/teasers and invalidate those pages

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

const getImage = async (tenant: string): Promise<string> => {
  const payload = await getPayloadCached();
  const image = await payload.create({
    collection: 'images',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      alt: 'image',
      tenant,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  return image.id;
};

test('invalidates page with cta contact if person is changed (sagw)', {
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

  const image = await getImage(tenant);
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
    collection: 'people',
    data: {
      firstname: simpleRteConfig('changed'),
    },
    id: person.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with people overview if person is changed (sagw)', {
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

  const image = await getImage(tenant);
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
    collection: 'people',
    data: {
      firstname: simpleRteConfig('changed'),
    },
    id: person.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with cta contact if person is changed (non-sagw)', {
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

  const image = await getImage(tenant);
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
    collection: 'people',
    data: {
      firstname: simpleRteConfig('changed'),
    },
    id: person.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});

test('invalidates page with people overview if person is changed (non-sagw)', {
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

  const image = await getImage(tenant);
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
    collection: 'people',
    data: {
      firstname: simpleRteConfig('changed'),
    },
    id: person.id,
  });

  logCapture.detachLogs();

  expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}/${detailPage.slug}`))
    .toBe(true);

  expect(logCapture.logs)
    .toHaveLength(1);

});
