import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import {
  generateTenant, getTenantId,
} from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  deleteOtherCollections, deleteSetsPages, deleteTenants,
} from '@/seed/test-data/deleteData';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

const defaultMeta = (time: number, lang?: string): any => ({
  meta: {
    seo: {
      description: `description ${time}${lang || ''}`,
      index: false,
      keywords: [
        {
          keyword: `keyword 1 ${time}${lang || ''}`,
        },
        {
          keyword: `keyword 2 ${time}${lang || ''}`,
        },
      ],
      title: `title ${time}${lang || ''}`,
    },
  },
});

test.describe('render meta home', () => {
  beforeEachAcceptCookies();

  test('correctly renders meta (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time),
        tenant,
      },
      id: home,
      locale: 'de',
    });

    await page.goto('http://localhost:3000/de/');
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/fr');
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/it');
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', 'http://localhost:3000/en');
  });

  test('correctly renders meta italian (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: {
          optionalLink: {
            link: {
              linkText: simpleRteConfig('foo'),
            },
          },
          sideTitle: simpleRteConfig('sidetitle'),
          title: simpleRteConfig('title'),
        },
        tenant,
      },
      id: home,
      locale: 'it',
    });

    await page.goto('http://localhost:3000/it/');
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', 'http://localhost:3000/it');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/fr');
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/it');
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', 'http://localhost:3000/en');
  });

  test('correctly renders meta (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time),
        tenant,
      },
      id: home,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}-fr`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}-it`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}-en`);
  });

  test('correctly renders meta italian (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: {
          sideTitle: simpleRteConfig('sidetitle'),
          title: simpleRteConfig('title'),
        },
        tenant,
      },
      id: home,
      locale: 'it',
    });

    await page.goto(`http://localhost:3000/it/tenant-${time}-it`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}-it`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}-fr`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}-it`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}-en`);
  });

  test('only emits alternates for tenant-enabled locales', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    await deleteTenants();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenantDoc = await generateTenant({
      name: `tenant-${time}`,
    });

    await payload.update({
      collection: 'tenants',
      data: {
        languages: {
          de: true,
          en: false,
          fr: true,
          it: false,
        },
      },
      id: tenantDoc.id,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenantDoc.id,
    });

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time),
        tenant: tenantDoc.id,
      },
      id: home,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}-fr`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveCount(0);
  });
});

test.describe('render meta on other pages', () => {
  beforeEachAcceptCookies();

  test('correctly renders meta (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/de/detail-de-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/detail-en-${time}`);
  });

  test('correctly renders meta italian (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/it/detail-it-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/detail-en-${time}`);
  });

  test('correctly renders meta (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}-fr/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}-it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}-en/detail-en-${time}`);
  });

  test('correctly renders meta italian (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/it/tenant-${time}-it/detail-it-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}-it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}-fr/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}-it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}-en/detail-en-${time}`);
  });
});
