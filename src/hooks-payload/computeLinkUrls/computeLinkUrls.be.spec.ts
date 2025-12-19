import {
  expect,
  test,
} from '@playwright/test';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  generateDetailPage,
  generateHomePage,
  generateOverviewPage,
} from '@/test-helpers/page-generator';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

const getCollectionsDocumentForId = async (id: string): Promise<any> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const linksCollectionDocument = await payload.find({
    collection: 'links',
    limit: 1,
    where: {
      and: [
        {
          documentId: {
            equals: id,
          },
        },
      ],
    },
  });

  return linksCollectionDocument.docs[0];
};

test('Page without parent page', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const detailPage = await generateDetailPage({
      navigationTitle: 'd1',
      title: `d1 ${time}`,
    });

    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.url.de)
    .toBe(`/de/d1-${time}`);

  await expect(result.url.fr)
    .toBe('/fr');

  await expect(result.url.it)
    .toBe('/it');

  await expect(result.url.en)
    .toBe('/en');

});

test('Page without parent page (non-sagw)', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'd1',
      tenant: tenant.id,
      title: `d1 ${time}`,
    });

    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.url.de)
    .toBe(`/de/${time}-tenant-1/d1-${time}`);

  await expect(result.url.fr)
    .toBe('/fr');

  await expect(result.url.it)
    .toBe('/it');

  await expect(result.url.en)
    .toBe('/en');

});

test('Page with parent page', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const overviewPage = await generateOverviewPage({
      navigationTitle: 'o1',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `o1 ${time}`,
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      title: `d1 ${time}`,
    });

    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.url.de)
    .toBe(`/de/o1-${time}/d1-${time}`);

  await expect(result.url.fr)
    .toBe('/fr');

  await expect(result.url.it)
    .toBe('/it');

  await expect(result.url.en)
    .toBe('/en');

});

test('Page with parent page (non-sagw)', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-2`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const overviewPage = await generateOverviewPage({
      navigationTitle: 'o1',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `o1 ${time}`,
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `d1 ${time}`,
    });

    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.url.de)
    .toBe(`/de/${time}-tenant-2/o1-${time}/d1-${time}`);

  await expect(result.url.fr)
    .toBe('/fr');

  await expect(result.url.it)
    .toBe('/it');

  await expect(result.url.en)
    .toBe('/en');

});

test('Creates links for all locales', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const overviewPage = await generateOverviewPage({
      navigationTitle: 'o1',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `o1 ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`o1-fr ${time}`),
        },
      },
      id: overviewPage.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`o1-it ${time}`),
        },
      },
      id: overviewPage.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`o1-en ${time}`),
        },
      },
      id: overviewPage.id,
      locale: 'en',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      title: `d1 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d1-fr ${time}`),
        },
      },
      id: detailPage.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d1-it ${time}`),
        },
      },
      id: detailPage.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d1-en ${time}`),
        },
      },
      id: detailPage.id,
      locale: 'en',
    });

    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.url.de)
    .toBe(`/de/o1-${time}/d1-${time}`);

  await expect(result.url.fr)
    .toBe(`/fr/o1-fr-${time}/d1-fr-${time}`);

  await expect(result.url.it)
    .toBe(`/it/o1-it-${time}/d1-it-${time}`);

  await expect(result.url.en)
    .toBe(`/en/o1-en-${time}/d1-en-${time}`);

});

test('Creates links for all locales (non-sagw)', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const tenant = await generateTenant({
      name: `${time}-tenant-3`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const overviewPage = await generateOverviewPage({
      navigationTitle: 'o1',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `o1 ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`o1-fr ${time}`),
        },
      },
      id: overviewPage.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`o1-it ${time}`),
        },
      },
      id: overviewPage.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`o1-en ${time}`),
        },
      },
      id: overviewPage.id,
      locale: 'en',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `d1 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d1-fr ${time}`),
        },
      },
      id: detailPage.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d1-it ${time}`),
        },
      },
      id: detailPage.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d1-en ${time}`),
        },
      },
      id: detailPage.id,
      locale: 'en',
    });

    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.url.de)
    .toBe(`/de/${time}-tenant-3/o1-${time}/d1-${time}`);

  await expect(result.url.fr)
    .toBe(`/fr/${time}-tenant-3-fr/o1-fr-${time}/d1-fr-${time}`);

  await expect(result.url.it)
    .toBe(`/it/${time}-tenant-3-it/o1-it-${time}/d1-it-${time}`);

  await expect(result.url.en)
    .toBe(`/en/${time}-tenant-3-en/o1-en-${time}/d1-en-${time}`);

});
